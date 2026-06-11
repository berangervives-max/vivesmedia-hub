import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PHASE_LABELS, PHASE_ORDER, TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from '@/types/database'
import type { ProjectPhase } from '@/types/database'
import { ArrowLeft, ExternalLink, Star } from 'lucide-react'
import PhaseSelector from '@/components/admin/PhaseSelector'
import FileUpload from '@/components/admin/FileUpload'
import VideoManager from '@/components/admin/VideoManager'
import ReviewButton from '@/components/admin/ReviewButton'

const PHASE_COLORS: Record<ProjectPhase, string> = {
  onboarding: 'bg-blue-100 text-blue-700',
  design: 'bg-purple-100 text-purple-700',
  dev: 'bg-yellow-100 text-yellow-700',
  recette: 'bg-orange-100 text-orange-700',
  livraison: 'bg-green-100 text-green-700',
  maintenance: 'bg-zinc-100 text-zinc-700',
}

const TICKET_PRIORITY_COLORS = {
  low: 'bg-zinc-100 text-zinc-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*, clients(name, email, company)')
    .eq('id', projectId)
    .single()

  if (!project) notFound()

  const client = Array.isArray(project.clients) ? project.clients[0] : project.clients

  const [{ data: phaseHistory }, { data: files }, { data: videos }, { data: tickets }, { data: form }] =
    await Promise.all([
      supabase
        .from('phase_history')
        .select('*')
        .eq('project_id', projectId)
        .order('changed_at', { ascending: false }),
      supabase.from('files').select('*').eq('project_id', projectId).order('uploaded_at', { ascending: false }),
      supabase.from('training_videos').select('*').eq('project_id', projectId).order('position'),
      supabase.from('tickets').select('*').eq('project_id', projectId).order('created_at', { ascending: false }),
      supabase.from('onboarding_forms').select('id').eq('project_id', projectId).maybeSingle(),
    ])

  const currentPhaseIndex = PHASE_ORDER.indexOf(project.current_phase as ProjectPhase)
  const canSendReview =
    project.current_phase === 'livraison' || project.current_phase === 'maintenance'

  return (
    <div className="p-8">
      <Link
        href="/admin/projects"
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux projets
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">{project.name}</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {client?.name} · {client?.email}
            {client?.company && <span> · {client.company}</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {canSendReview && (
            <ReviewButton projectId={projectId} />
          )}
          <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${PHASE_COLORS[project.current_phase as ProjectPhase]}`}>
            {PHASE_LABELS[project.current_phase as ProjectPhase]}
          </span>
        </div>
      </div>

      {/* Phase progression */}
      <Card className="border-0 shadow-sm mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-zinc-700">Progression du projet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-0 mb-6">
            {PHASE_ORDER.map((phase, index) => (
              <div key={phase} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      index <= currentPhaseIndex
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-400'
                    }`}
                  >
                    {index < currentPhaseIndex ? '✓' : index + 1}
                  </div>
                  <span className="text-xs text-zinc-500 mt-1.5 text-center leading-tight">
                    {PHASE_LABELS[phase]}
                  </span>
                </div>
                {index < PHASE_ORDER.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-1 -mt-5 ${
                      index < currentPhaseIndex ? 'bg-zinc-900' : 'bg-zinc-100'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <PhaseSelector
            projectId={projectId}
            currentPhase={project.current_phase as ProjectPhase}
            clientEmail={client?.email ?? ''}
            clientName={client?.name ?? ''}
            projectName={project.name}
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="history">
        <TabsList className="mb-6">
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="onboarding">
            Onboarding
            {!form && <span className="ml-1.5 w-2 h-2 rounded-full bg-orange-400 inline-block" />}
          </TabsTrigger>
          <TabsTrigger value="files">Fichiers ({files?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="training">Formation ({videos?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="tickets">Tickets ({tickets?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              {!phaseHistory?.length ? (
                <p className="text-sm text-zinc-400 text-center py-4">Aucun historique.</p>
              ) : (
                <div className="space-y-3">
                  {phaseHistory.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-zinc-900 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-zinc-900">
                          → {PHASE_LABELS[entry.phase as ProjectPhase]}
                        </p>
                        {entry.note && (
                          <p className="text-xs text-zinc-500 mt-0.5">{entry.note}</p>
                        )}
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {new Date(entry.changed_at).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-zinc-700">
                  Formulaire d'onboarding
                </CardTitle>
                <Link
                  href={`/admin/projects/${projectId}/form`}
                  className="flex items-center gap-1.5 text-xs bg-zinc-900 text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  {form ? 'Modifier le formulaire' : 'Créer le formulaire'}
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {form ? (
                <p className="text-sm text-green-600">
                  ✓ Formulaire créé et disponible pour le client.
                </p>
              ) : (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                  <p className="text-sm font-medium text-orange-800">Aucun formulaire créé</p>
                  <p className="text-xs text-orange-600 mt-1">
                    Créez un formulaire d'onboarding pour recueillir les informations de démarrage du client.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-zinc-700">
                Fichiers & Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload projectId={projectId} initialFiles={files ?? []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-zinc-700">
                Vidéos de formation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VideoManager projectId={projectId} initialVideos={videos ?? []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              {!tickets?.length ? (
                <p className="text-sm text-zinc-400 text-center py-4">Aucun ticket de support.</p>
              ) : (
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 bg-zinc-50 rounded-xl">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-900">{ticket.title}</p>
                          <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{ticket.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            ticket.status === 'open' ? 'bg-red-100 text-red-700' :
                            ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {TICKET_STATUS_LABELS[ticket.status as keyof typeof TICKET_STATUS_LABELS]}
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TICKET_PRIORITY_COLORS[ticket.priority as keyof typeof TICKET_PRIORITY_COLORS]}`}>
                            {TICKET_PRIORITY_LABELS[ticket.priority as keyof typeof TICKET_PRIORITY_LABELS]}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 mt-2">
                        Ouvert le {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
