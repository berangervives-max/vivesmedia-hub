import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OnboardingForm from '@/components/client/OnboardingForm'
import type { Database, FormField } from '@/types/database'

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
    <div className="min-h-screen bg-zinc-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">{project.name}</p>
          <h1 className="text-2xl font-semibold text-zinc-900">{form.title}</h1>
          <p className="text-sm text-zinc-500 mt-2">
            Merci de compléter ce formulaire pour démarrer votre projet.
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
    </div>
  )
}
