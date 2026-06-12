import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OnboardingForm from '@/components/client/OnboardingForm'
import type { Database, FormField } from '@/types/database'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type FormWithResponse = Database['public']['Tables']['onboarding_forms']['Row'] & {
  form_responses: Database['public']['Tables']['form_responses']['Row'][]
}

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: client } = await supabase
    .from('clients')
    .select('id, name')
    .eq('user_id', user.id)
    .single()

  if (!client) redirect('/dashboard')

  const { data: project } = await supabase
    .from('projects')
    .select('id, name, client_id')
    .eq('id', projectId)
    .eq('client_id', client.id)
    .single()

  if (!project) notFound()

  const { data: rawForm } = await supabase
    .from('onboarding_forms')
    .select('*, form_responses(*)')
    .eq('project_id', projectId)
    .maybeSingle()

  if (!rawForm) redirect(`/dashboard/${projectId}`)

  const form = rawForm as unknown as FormWithResponse
  const existingResponse = form.form_responses?.[0]

  if (existingResponse?.is_complete) redirect(`/dashboard/${projectId}`)

  return (
    <div className="max-w-xl mx-auto">
      <Link
        href={`/dashboard/${projectId}`}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au projet
      </Link>

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: '#F4521E' }}>
          {project.name}
        </p>
        <h1 className="text-2xl font-bold text-foreground">{form.title}</h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Merci de compléter ce formulaire pour démarrer votre projet. Cela prend 5 à 10 minutes.
        </p>
      </div>

      <OnboardingForm
        formId={form.id}
        projectId={projectId}
        fields={form.fields as FormField[]}
        existingResponses={
          (existingResponse?.responses as Record<string, string | string[]>) ?? {}
        }
      />
    </div>
  )
}
