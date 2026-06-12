import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendAdminOnboardingCompleteAlert } from '@/lib/resend'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: client } = await supabase
    .from('clients')
    .select('id, name')
    .eq('user_id', user.id)
    .single()

  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  const { data: project } = await supabase
    .from('projects')
    .select('id, name')
    .eq('id', projectId)
    .eq('client_id', client.id)
    .single()

  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const body = await request.json()
  const { formId, responses } = body as {
    formId: string
    responses: Record<string, string | string[]>
  }

  if (!formId || !responses) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { error } = await supabase.from('form_responses').upsert(
    {
      form_id: formId,
      client_id: client.id,
      responses,
      is_complete: true,
      submitted_at: new Date().toISOString(),
    },
    { onConflict: 'form_id,client_id' }
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const adminEmail = process.env.ADMIN_EMAIL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  if (adminEmail) {
    sendAdminOnboardingCompleteAlert({
      adminEmail,
      clientName: client.name,
      projectName: project.name,
      projectUrl: `${appUrl}/admin/projects/${projectId}`,
    }).catch(() => {})
  }

  return NextResponse.json({ success: true })
}
