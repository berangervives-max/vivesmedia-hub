import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PHASE_LABELS, PHASE_ORDER, phaseIndex } from '@/lib/phases'
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from '@/types/database'
import type { ProjectPhase } from '@/types/database'
import { ArrowLeft, ExternalLink, Check } from 'lucide-react'
import PhaseSelector from '@/components/admin/PhaseSelector'
import FileUpload from '@/components/admin/FileUpload'
import VideoManager from '@/components/admin/VideoManager'
import ReviewButton from '@/components/admin/ReviewButton'
import FormationGenerator from '@/components/admin/FormationGenerator'

const TICKET_PRIORITY_COLORS = {
  low: 'bg-secondary text-muted-foreground',
  medium: 'bg-(--sem-warn-bg) text-(--sem-warn-fg)',
  high: 'bg-(--sem-danger-bg) text-(--sem-danger-fg)',
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

  const phase = project.current_phase as ProjectPhase
  const currentPhaseIndex = phaseIndex(phase)
  const canSendReview = phase === 'livraison' || phase === 'maintenance'

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <Link
        href="/admin/projects"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux projets
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div>
          <p className="hub-eyebrow">Projet client</p>
          <h1 className="text-2xl font-bold text-foreground mt-1.5">{project.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            <span className="hub-accent text-foreground/80">{client?.name}</span> · {client?.email}
            {client?.company && <span> · {client.company}</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {canSendReview && <ReviewButton projectId={projectId} />}
          <span className="phase-badge" data-phase={phase}>{PHASE_LABELS[phase]}</span>
        </div>
      </div>

      {/* Progression du projet */}
      <div className="hub-card p-6 mb-6">
        <p className="text-sm font-semibold text-foreground mb-5">Progression du projet</p>
        <div className="hub-stepper mb-6">
          {PHASE_ORDER.map((p, index) => {
            const state = index < currentPhaseIndex ? 'is-done' : index === currentPhaseIndex ? 'is-current' : ''
            return (
              <div key={p} className={`hub-step ${state}`}>
                <span className="ln" />
                <span className="bul">{index < currentPhaseIndex && <Check strokeWidth={3} />}</span>
                <span className="lb">{PHASE_LABELS[p]}</span>
              </div>
            )
          })}
        </div>

        <PhaseSelector
          projectId={projectId}
          currentPhase={phase}
          clientEmail={client?.email ?? ''}
          clientName={client?.name ?? ''}
          projectName={project.name}
        />
      </div>

      <Tabs defaultValue="history">
        <TabsList className="mb-6 bg-secondary rounded-xl p-1 flex-wrap h-auto">
          <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Historique</TabsTrigger>
          <TabsTrigger value="onboarding" className="rounded-lg gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
            Onboarding
            {!form && <span className="w-2 h-2 rounded-full inline-block bg-primary" />}
          </TabsTrigger>
          <TabsTrigger value="files" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Fichiers ({files?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="training" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Formation ({videos?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="tickets" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Tickets ({tickets?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <div className="hub-card p-6">
            {!phaseHistory?.length ? (
              <p className="text-sm text-muted-foreground text-center py-4">Aucun historique.</p>
            ) : (
              <div className="space-y-4">
                {phaseHistory.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-primary" />
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
          <div className="hub-card p-6">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
              <p className="text-sm font-semibold text-foreground">Formulaire d&apos;onboarding</p>
              <Link
                href={`/admin/projects/${projectId}/form`}
                className="hub-btn hub-btn-primary hub-btn-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {form ? 'Modifier le formulaire' : 'Créer le formulaire'}
              </Link>
            </div>
            {form ? (
              <p className="text-sm font-medium text-(--sem-ok-fg) flex items-center gap-1.5">
                <Check className="w-4 h-4" strokeWidth={3} />
                Formulaire créé et disponible pour le client.
              </p>
            ) : (
              <div className="rounded-xl p-4 border border-primary/15 bg-primary/6">
                <p className="text-sm font-medium text-foreground">Aucun formulaire créé</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Créez un formulaire d&apos;onboarding pour recueillir les informations de démarrage du client.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="files">
          <div className="hub-card p-6">
            <p className="text-sm font-semibold text-foreground mb-4">Fichiers &amp; Documents</p>
            <FileUpload projectId={projectId} initialFiles={files ?? []} />
          </div>
        </TabsContent>

        <TabsContent value="training">
          <div className="space-y-4">
            <div className="hub-card p-6">
              <p className="text-sm font-semibold text-foreground mb-4">Vidéos de formation</p>
              <VideoManager projectId={projectId} initialVideos={videos ?? []} />
            </div>
            <FormationGenerator projectId={projectId} />
          </div>
        </TabsContent>

        <TabsContent value="tickets">
          <div className="hub-card p-6">
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
                          ticket.status === 'open' ? 'bg-(--sem-danger-bg) text-(--sem-danger-fg)' :
                          ticket.status === 'in_progress' ? 'bg-(--sem-warn-bg) text-(--sem-warn-fg)' :
                          'bg-(--sem-ok-bg) text-(--sem-ok-fg)'
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
