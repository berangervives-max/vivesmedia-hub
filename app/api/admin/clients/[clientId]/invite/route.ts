import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendInvitationEmail } from '@/lib/resend'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const isAdmin =
    user.user_metadata?.role === 'admin' ||
    user.email === process.env.ADMIN_EMAIL

  if (!isAdmin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })

  const adminClient = createAdminClient()

  const { data: client } = await adminClient
    .from('clients')
    .select('email, name, projects(name)')
    .eq('id', clientId)
    .single()

  if (!client) return NextResponse.json({ error: 'Client introuvable' }, { status: 404 })

  const projects = (client.projects as unknown as { name: string }[] | null) ?? []
  const projectName = projects[0]?.name ?? 'Votre projet'

  const { data: magicLinkData, error } = await adminClient.auth.admin.generateLink({
    type: 'magiclink',
    email: client.email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error || !magicLinkData?.properties?.action_link) {
    return NextResponse.json({ error: 'Impossible de générer le lien de connexion' }, { status: 500 })
  }

  await sendInvitationEmail({
    to: client.email,
    clientName: client.name,
    projectName,
    magicLink: magicLinkData.properties.action_link,
  })

  return NextResponse.json({ sent: true })
}
