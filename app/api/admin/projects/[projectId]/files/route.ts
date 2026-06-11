import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendNewFileEmail } from '@/lib/resend'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const adminEmail = process.env.ADMIN_EMAIL
  if (!user || (user.user_metadata?.role !== 'admin' && user.email !== adminEmail)) {
    return { supabase, user: null }
  }
  return { supabase, user }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params
  const { supabase, user } = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const category = formData.get('category') as string | null

  if (!file || !category) {
    return NextResponse.json({ error: 'Missing file or category' }, { status: 400 })
  }

  const { data: project } = await supabase
    .from('projects')
    .select('name, clients(name, email)')
    .eq('id', projectId)
    .single()

  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const adminClient = createAdminClient()
  const ext = file.name.split('.').pop() ?? 'bin'
  const storagePath = `${projectId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await adminClient.storage
    .from('hub-files')
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data: fileRow, error: insertError } = await supabase
    .from('files')
    .insert({
      project_id: projectId,
      name: file.name,
      category: category as 'file' | 'maquette' | 'invoice',
      storage_path: storagePath,
      uploaded_by: user.id,
      size_bytes: file.size,
    })
    .select()
    .single()

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  const clientData = Array.isArray(project.clients) ? project.clients[0] : project.clients
  if (clientData?.email) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
    await sendNewFileEmail({
      to: clientData.email,
      clientName: clientData.name,
      projectName: project.name,
      fileName: file.name,
      fileCategory: category,
      dashboardUrl: `${appUrl}/dashboard/${projectId}`,
    }).catch(() => null)

    await supabase.from('notifications_log').insert({
      project_id: projectId,
      type: 'new_file',
      recipient_email: clientData.email,
      metadata: { file_id: fileRow.id, file_name: file.name },
    })
  }

  return NextResponse.json({ file: fileRow })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params
  const { supabase, user } = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { fileId } = await request.json()
  if (!fileId) return NextResponse.json({ error: 'Missing fileId' }, { status: 400 })

  const { data: fileRow } = await supabase
    .from('files')
    .select('storage_path')
    .eq('id', fileId)
    .eq('project_id', projectId)
    .single()

  if (!fileRow) return NextResponse.json({ error: 'File not found' }, { status: 404 })

  const adminClient = createAdminClient()
  await adminClient.storage.from('hub-files').remove([fileRow.storage_path])

  const { error } = await supabase.from('files').delete().eq('id', fileId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
