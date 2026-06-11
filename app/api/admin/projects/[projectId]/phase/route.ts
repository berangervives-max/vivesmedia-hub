import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPhaseChangeEmail } from '@/lib/resend'
import { PHASE_LABELS } from '@/types/database'
import type { ProjectPhase } from '@/types/database'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const isAdmin =
    user.user_metadata?.role === 'admin' ||
    user.email === process.env.ADMIN_EMAIL

  if (!isAdmin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const { phase, note } = await request.json()

  if (!phase) return NextResponse.json({ error: 'Phase requise' }, { status: 400 })

  const adminClient = createAdminClient()

  // Fetch project + client info
  const { data: project } = await adminClient
    .from('projects')
    .select('*, clients(name, email)')
    .eq('id', projectId)
    .single()

  if (!project) return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 })

  // Update phase
  const { error: updateError } = await adminClient
    .from('projects')
    .update({ current_phase: phase })
    .eq('id', projectId)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  // Log history
  await adminClient.from('phase_history').insert({
    project_id: projectId,
    phase,
    changed_by: user.id,
    note: note || null,
  })

  // Send email to client
  const client = Array.isArray(project.clients) ? project.clients[0] : project.clients
  if (client?.email) {
    try {
      await sendPhaseChangeEmail({
        to: client.email,
        clientName: client.name,
        projectName: project.name,
        phaseLabel: PHASE_LABELS[phase as ProjectPhase],
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        note,
      })

      await adminClient.from('notifications_log').insert({
        project_id: projectId,
        type: 'phase_change',
        recipient_email: client.email,
        metadata: { phase, note: note || null },
      })
    } catch {
      // Email failed but phase was updated — non-blocking
    }
  }

  return NextResponse.json({ success: true })
}
