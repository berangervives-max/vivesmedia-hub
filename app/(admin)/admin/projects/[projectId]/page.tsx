import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PHASE_LABELS, PHASE_ORDER, TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from '@/types/database'
import type { ProjectPhase } from '@/types/database'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import PhaseSelector from '@/components/admin/PhaseSelector'
import FileUpload from '@/components/admin/FileUpload'
import VideoManager from '@/components/admin/VideoManager'
import ReviewButton from '@/components/admin/ReviewButton'
import FormationGenerator from '@/components/admin/FormationGenerator'

const PHASE_COLORS: Record<ProjectPhase, string> = {
  onboarding: 'bg-blue-50 text-blue-600',
  design: 'bg-purple-50 text-purple-600',
  dev: 'bg-amber-50 text-amber-600',
  recette: 'bg-orange-50 text-orange-600',
  livraison: 'bg-emerald-50 text-emerald-600',
  maintenance: 'bg-secondary text-muted-foreground',
}

const TICKET_PRIORITY_COLORS = {
  low: 'bg-secondary text-muted-foreground',
  medium: 'bg-amber-50 text-amber-700',
  high: 'bg-red-50 text-red-700',
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
    <div className="p-8 max-w-5xl">
      <Link
        href="/admin/projects"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux projets
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {client?.name} · {client?.email}
            {client?.company && <span> · {client.company}</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {canSendReview && <ReviewButton projectId={projectId} />}
          <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${PHASE_COLORS[project.current_phase as ProjectPhase]}`}>
            {PHASE_LABELS[project.current_phase as ProjectPhase]}
          </span>
        </div>
      </div>

      {/* Phase progression */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <p className="text-sm font-semibold text-foreground mb-5">Progression du projet</p>
        <div className="flex items-center gap-0 mb-6">
          {PHASE_ORDER.map((phase, index) => (
            <div key={phase} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                    index <= currentPhaseIndex
                      ? 'text-white'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                  style={index <= currentPhaseIndex ? { backgroundColor: '#F4521E' } : {}}
                >
                  {index < currentPhaseIndex ? '✓' : index + 1}
                </div>
                <span className="text-xs text-muted-foreground mt-1.5 text-center leading-tight">
                  {PHASE_LABELS[phase]}
                </span>
              </div>
              {index < PHASE_ORDER.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 -mt-5 ${
                    index < currentPhaseIndex ? '' : 'bg-border'
                  }`}
                  style={index < currentPhaseIndex ? { backgroundColor: '#F4521E' } : {}}
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
      </div>

      <Tabs defaultValue="history">
        <TabsList className="mb-6 bg-secondary rounded-xl p-1">
          <TabsTrigger value="history" className="rounded-lg">Historique</TabsTrigger>
          <TabsTrigger value="onboarding" className="rounded-lg">
            Onboarding
            {!form && <span className="ml-1.5 w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#F4521E' }} />}
          </TabsTrigger>
          <TabsTrigger value="files" className="rounded-lg">Fichiers ({files?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="training" className="rounded-lg">Formation ({videos?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="tickets" className="rounded-lg">Tickets ({tickets?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <div className="bg-card rounded-2xl border border-border p-6">
            {!phaseHistory?.length ? (
              <p className="text-sm text-muted-foreground text-center py-4">Aucun historique.</p>
            ) : (
              <div className="space-y-4">
                {phaseHistory.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: '#F4521E' }}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        → {PHASE_LABELS[entry.phase as ProjectPhase]}
                      </p>
                      {entry.note && (
                        <p className="text-xs text-muted-foreground mt-0.5">{entry.note}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
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
          </div>
        </TabsContent>

        <TabsContent value="onboarding">
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-foreground">Formulaire d'onboarding</p>
              <Link
                href={`/admin/projects/${projectId}/form`}
                className="flex items-center gap-1.5 text-xs text-white px-3 py-1.5 rounded-full hover:opacity-90 transition-colors"
                style={{ backgroundColor: '#F4521E' }}
              >
                <ExternalLink className="w-3 h-3" />
                {form ? 'Modifier le formulaire' : 'Créer le formulaire'}
              </Link>
            </div>
            {form ? (
              <p className="text-sm text-emerald-600 font-medium">
                ✓ Formulaire créé et disponible pour le client.
              </p>
            ) : (
              <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(244,82,30,0.06)', border: '1px solid rgba(244,82,30,0.15)' }}>
                <p className="text-sm font-medium text-foreground">Aucun formulaire créé</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Créez un formulaire d'onboarding pour recueillir les informations de démarrage du client.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="files">
          <div className="bg-card rounded-2xl border border-border p-6">
            <p className="text-sm font-semibold text-foreground mb-4">Fichiers & Documents</p>
            <FileUpload projectId={projectId} initialFiles={files ?? []} />
          </div>
        </TabsContent>

        <TabsContent value="training">
          <div className="space-y-4">
            <div className="bg-card rounded-2xl border border-border p-6">
              <p className="text-sm font-semibold text-foreground mb-4">Vidéos de formation</p>
              <VideoManager projectId={projectId} initialVideos={videos ?? []} />
            </div>
            <FormationGenerator projectId={projectId} />
          </div>
        </TabsContent>

        <TabsContent value="tickets">
          <div className="bg-card rounded-2xl border border-border p-6">
            {!tickets?.length ? (
              <p className="text-sm text-muted-foreground text-center py-4">Aucun ticket de support.</p>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 bg-secondary/50 rounded-xl">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{ticket.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ticket.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          ticket.status === 'open' ? 'bg-red-50 text-red-700' :
                          ticket.status === 'in_progress' ? 'bg-amber-50 text-amber-700' :
                          'bg-emerald-50 text-emerald-700'
                        }`}>
                          {TICKET_STATUS_LABELS[ticket.status as keyof typeof TICKET_STATUS_LABELS]}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TICKET_PRIORITY_COLORS[ticket.priority as keyof typeof TICKET_PRIORITY_COLORS]}`}>
                          {TICKET_PRIORITY_LABELS[ticket.priority as keyof typeof TICKET_PRIORITY_LABELS]}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Ouvert le {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
