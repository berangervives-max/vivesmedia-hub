import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendInvitationEmail } from '@/lib/resend'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const isAdmin =
    user.user_metadata?.role === 'admin' ||
    user.email === process.env.ADMIN_EMAIL

  if (!isAdmin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
  }

  const body = await request.json()
  const { name, email, company, phone, projectName } = body

  if (!name || !email || !projectName) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  const adminClient = createAdminClient()

  // Create client record
  const { data: client, error: clientError } = await adminClient
    .from('clients')
    .insert({ name, email, company: company || null, phone: phone || null, created_by: user.id })
    .select()
    .single()

  if (clientError) {
    return NextResponse.json({ error: clientError.message }, { status: 500 })
  }

  // Create first project
  const { data: project, error: projectError } = await adminClient
    .from('projects')
    .insert({ client_id: client.id, name: projectName, current_phase: 'onboarding' })
    .select()
    .single()

  if (projectError) {
    return NextResponse.json({ error: projectError.message }, { status: 500 })
  }

  // Generate magic link for invitation
  const { data: magicLinkData, error: magicLinkError } = await adminClient.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (magicLinkError || !magicLinkData.properties?.action_link) {
    // Client created but email failed — return partial success
    return NextResponse.json({ client, project, emailSent: false })
  }

  // Send invitation email
  try {
    await sendInvitationEmail({
      to: email,
      clientName: name,
      projectName,
      magicLink: magicLinkData.properties.action_link,
    })
  } catch {
    return NextResponse.json({ client, project, emailSent: false })
  }

  return NextResponse.json({ client, project, emailSent: true })
}
