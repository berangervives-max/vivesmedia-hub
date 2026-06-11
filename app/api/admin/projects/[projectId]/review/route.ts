import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendReviewRequestEmail } from '@/lib/resend'

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
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params
  const { supabase, user } = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: project } = await supabase
    .from('projects')
    .select('name, current_phase, clients(name, email)')
    .eq('id', projectId)
    .single()

  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  if (project.current_phase !== 'livraison' && project.current_phase !== 'maintenance') {
    return NextResponse.json(
      { error: 'Review requests can only be sent for projects in delivery or maintenance phase' },
      { status: 400 }
    )
  }

  const clientData = Array.isArray(project.clients) ? project.clients[0] : project.clients
  if (!clientData?.email) {
    return NextResponse.json({ error: 'Client email not found' }, { status: 400 })
  }

  const reviewUrl = process.env.GOOGLE_REVIEW_URL ?? 'https://vivesmedia.com'

  await sendReviewRequestEmail({
    to: clientData.email,
    clientName: clientData.name,
    projectName: project.name,
    reviewUrl,
  })

  await supabase.from('notifications_log').insert({
    project_id: projectId,
    type: 'review_request',
    recipient_email: clientData.email,
    metadata: { project_name: project.name },
  })

  return NextResponse.json({ success: true })
}
