import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { PHASE_LABELS, PHASE_ORDER } from '@/types/database'
import type { Database, ProjectPhase, FileCategory } from '@/types/database'
import { FileText, Image, Receipt, Play, ArrowLeft, ChevronRight } from 'lucide-react'

const PHASE_COLORS: Record<ProjectPhase, string> = {
  onboarding: 'bg-blue-100 text-blue-700',
  design: 'bg-purple-100 text-purple-700',
  dev: 'bg-yellow-100 text-yellow-700',
  recette: 'bg-orange-100 text-orange-700',
  livraison: 'bg-green-100 text-green-700',
  maintenance: 'bg-zinc-100 text-zinc-700',
}

const FILE_ICONS: Record<FileCategory, React.ElementType> = {
  file: FileText,
  maquette: Image,
  invoice: Receipt,
}

const FILE_LABELS: Record<FileCategory, string> = {
  file: 'Document',
  maquette: 'Maquette',
  invoice: 'Facture',
}

export default async function ClientProjectPage({
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
    .select('*')
    .eq('id', projectId)
    .eq('client_id', client.id)
    .single()

  if (!project) notFound()

  type FormWithResponses = Database['public']['Tables']['onboarding_forms']['Row'] & {
    form_responses: Database['public']['Tables']['form_responses']['Row'][]
  }

  const [{ data: rawForm }, { data: files }, { data: videos }, { data: tickets }] =
    await Promise.all([
      supabase.from('onboarding_forms').select('*, form_responses(*)').eq('project_id', projectId).maybeSingle(),
      supabase.from('files').select('*').eq('project_id', projectId).order('uploaded_at', { ascending: false }),
      supabase.from('training_videos').select('*').eq('project_id', projectId).order('position'),
      project.is_maintenance
        ? supabase.from('tickets').select('*').eq('project_id', projectId).eq('client_id', client.id).order('created_at', { ascending: false })
        : Promise.resolve({ data: null }),
    ])

  const form = rawForm as unknown as FormWithResponses | null
  const formResponse = form?.form_responses?.[0]
  const phaseIndex = PHASE_ORDER.indexOf(project.current_phase as ProjectPhase)
  const progress = Math.round(((phaseIndex + 1) / PHASE_ORDER.length) * 100)

  return (
    <div>
      {/* Back link only if multi-project */}
      <Link
        href="/dashboard"
        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Mes projets
      </Link>

      {/* Project header */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900">{project.name}</h1>
            <span className={`inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full ${PHASE_COLORS[project.current_phase as ProjectPhase]}`}>
              {PHASE_LABELS[project.current_phase as ProjectPhase]}
            </span>
          </div>
        </div>

        {/* Phase timeline */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span>Progression globale</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-zinc-900 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {PHASE_ORDER.map((phase, index) => (
              <div key={phase} className="flex items-center gap-1.5">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                  index < phaseIndex ? 'bg-zinc-900 text-white' :
                  index === phaseIndex ? 'bg-zinc-900 text-white ring-4 ring-zinc-200' :
                  'bg-zinc-100 text-zinc-400'
                }`}>
                  {index < phaseIndex ? '✓' : index + 1}
                </div>
                <span className={`text-xs ${index === phaseIndex ? 'text-zinc-900 font-medium' : 'text-zinc-400'}`}>
                  {PHASE_LABELS[phase]}
                </span>
                {index < PHASE_ORDER.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-zinc-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue={form ? 'onboarding' : 'files'}>
        <TabsList className="mb-6">
          {form && (
            <TabsTrigger value="onboarding" className="gap-2">
              Onboarding
              {!formResponse?.is_complete && (
                <span className="w-2 h-2 rounded-full bg-red-500" />
              )}
            </TabsTrigger>
          )}
          <TabsTrigger value="files">Fichiers ({files?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="training">Formation ({videos?.length ?? 0})</TabsTrigger>
          {project.is_maintenance && (
            <TabsTrigger value="support">Support ({tickets?.length ?? 0})</TabsTrigger>
          )}
        </TabsList>

        {form && (
          <TabsContent value="onboarding">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                {formResponse?.is_complete ? (
                  <div className="text-center py-6">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600">✓</span>
                    </div>
                    <p className="text-sm font-medium text-zinc-900">Formulaire complété !</p>
                    <p className="text-xs text-zinc-400 mt-1">Envoyé le {new Date(formResponse.submitted_at!).toLocaleDateString('fr-FR')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-blue-900">{form.title}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Merci de remplir ce formulaire pour démarrer votre projet.
                      </p>
                    </div>
                    <Link href={`/dashboard/${projectId}/onboarding`}>
                      <span className="inline-flex items-center gap-2 bg-zinc-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors">
                        Remplir le formulaire →
                      </span>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="files">
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              {!files?.length ? (
                <p className="text-sm text-zinc-400 text-center py-6">
                  Aucun document déposé pour l'instant.
                </p>
              ) : (
                <div className="space-y-2">
                  {files.map((file) => {
                    const Icon = FILE_ICONS[file.category as FileCategory]
                    return (
                      <a
                        key={file.id}
                        href={`/api/client/files/${file.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-zinc-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-900 truncate">{file.name}</p>
                          <p className="text-xs text-zinc-400">{FILE_LABELS[file.category as FileCategory]}</p>
                        </div>
                        <span className="text-xs text-zinc-400 shrink-0">
                          {new Date(file.uploaded_at).toLocaleDateString('fr-FR')}
                        </span>
                      </a>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              {!videos?.length ? (
                <p className="text-sm text-zinc-400 text-center py-6">
                  Aucune vidéo de formation disponible.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {videos.map((video) => (
                    <a
                      key={video.id}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block bg-zinc-50 rounded-xl p-4 hover:bg-zinc-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-zinc-900 truncate">{video.title}</p>
                          {video.description && (
                            <p className="text-xs text-zinc-400 truncate mt-0.5">{video.description}</p>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {project.is_maintenance && (
          <TabsContent value="support">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-zinc-700">Vos tickets de support</p>
                  <Link href={`/dashboard/${projectId}/support/new`}>
                    <span className="text-xs bg-zinc-900 text-white px-3 py-1.5 rounded-lg">
                      + Nouveau ticket
                    </span>
                  </Link>
                </div>
                {!tickets?.length ? (
                  <p className="text-sm text-zinc-400 text-center py-6">Aucun ticket ouvert.</p>
                ) : (
                  <div className="space-y-2">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50">
                        <div>
                          <p className="text-sm font-medium text-zinc-900">{ticket.title}</p>
                          <p className="text-xs text-zinc-400">{new Date(ticket.created_at).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          ticket.status === 'open' ? 'bg-red-100 text-red-700' :
                          ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {ticket.status === 'open' ? 'Ouvert' :
                           ticket.status === 'in_progress' ? 'En cours' :
                           ticket.status === 'resolved' ? 'Résolu' : 'Fermé'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
