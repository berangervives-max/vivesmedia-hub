import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!client) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: fileRow } = await supabase
    .from('files')
    .select('storage_path, name, project_id')
    .eq('id', fileId)
    .single()

  if (!fileRow) return NextResponse.json({ error: 'File not found' }, { status: 404 })

  const { data: project } = await supabase
    .from('projects')
    .select('client_id')
    .eq('id', fileRow.project_id)
    .single()

  if (!project || project.client_id !== client.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const adminClient = createAdminClient()
  const { data: signed, error } = await adminClient.storage
    .from('hub-files')
    .createSignedUrl(fileRow.storage_path, 3600)

  if (error || !signed?.signedUrl) {
    return NextResponse.json({ error: 'Could not generate signed URL' }, { status: 500 })
  }

  return NextResponse.redirect(signed.signedUrl)
}
