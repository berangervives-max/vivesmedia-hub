import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PHASE_LABELS, PHASE_ORDER, PHASE_DESCRIPTIONS, PHASE_TAGLINES, phaseIndex, phaseProgress } from '@/lib/phases'
import type { Database, ProjectPhase, FileCategory } from '@/types/database'
import { FileText, Image, Receipt, Play, ArrowLeft, Check, ArrowUpRight, MessageCircle, AlertCircle } from 'lucide-react'
import AiAssistant from '@/components/client/AiAssistant'

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

type FormWithResponses = Database['public']['Tables']['onboarding_forms']['Row'] & {
  form_responses: Database['public']['Tables']['form_responses']['Row'][]
}

export default async function ClientProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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
  const phase = project.current_phase as ProjectPhase
  const currentIndex = phaseIndex(phase)
  const progress = phaseProgress(phase)
  const hasOnboardingAction = form && !formResponse?.is_complete

  return (
    <div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Mes projets
      </Link>

      {/* Carte projet */}
      <div className="hub-card p-6 mb-6">
        <p className="hub-eyebrow">Votre projet</p>
        <h1 className="text-2xl font-bold text-foreground mt-2 tracking-tight">{project.name}</h1>
        <p className="hub-accent text-xl text-foreground/75 mt-1.5">{PHASE_TAGLINES[phase]}</p>

        <div className="flex items-center gap-3 flex-wrap mt-4 mb-5">
          <span className="phase-badge" data-phase={phase}>{PHASE_LABELS[phase]}</span>
          <span className="text-sm text-muted-foreground">{PHASE_DESCRIPTIONS[phase]}</span>
        </div>

        {/* Barre d'avancement */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>Avancement global</span>
          <span className="font-semibold text-foreground">{progress}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden mb-6">
          <div
            className="h-full rounded-full bg-linear-to-r from-primary to-[#FF7A45] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stepper de phase */}
        <div className="hub-stepper">
          {PHASE_ORDER.map((p, index) => {
            const state = index < currentIndex ? 'is-done' : index === currentIndex ? 'is-current' : ''
            return (
              <div key={p} className={`hub-step ${state}`}>
                <span className="ln" />
                <span className="bul">{index < currentIndex && <Check strokeWidth={3} />}</span>
                <span className="lb">{PHASE_LABELS[p]}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bannière action requise */}
      {hasOnboardingAction && (
        <div className="rounded-2xl border border-primary/20 bg-primary/6 p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary/10 text-primary">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Action requise : formulaire de démarrage</p>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                Pour démarrer votre projet, merci de compléter le formulaire d&apos;onboarding. Cela prend 5 à 10 minutes.
              </p>
              <Link href={`/dashboard/${projectId}/onboarding`} className="hub-btn hub-btn-primary hub-btn-sm">
                Remplir le formulaire <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Onglets */}
      <Tabs defaultValue={hasOnboardingAction ? 'onboarding' : 'files'}>
        <TabsList className="mb-6 bg-secondary rounded-xl p-1">
          {form && (
            <TabsTrigger value="onboarding" className="rounded-lg gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Onboarding
              {!formResponse?.is_complete && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </TabsTrigger>
          )}
          <TabsTrigger value="files" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            Documents {files?.length ? `(${files.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="training" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            Formation {videos?.length ? `(${videos.length})` : ''}
          </TabsTrigger>
          {project.is_maintenance && (
            <TabsTrigger value="support" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Support {(tickets as { length?: number } | null)?.length ? `(${(tickets as { length: number }).length})` : ''}
            </TabsTrigger>
          )}
        </TabsList>

        {/* Onboarding */}
        {form && (
          <TabsContent value="onboarding">
            <div className="hub-card p-6">
              {formResponse?.is_complete ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-(--sem-ok-bg) text-(--sem-ok-fg)">
                    <Check className="w-5 h-5" strokeWidth={3} />
                  </div>
                  <p className="text-base font-bold text-foreground">Formulaire complété</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Envoyé le {new Date(formResponse.submitted_at!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-4 max-w-xs mx-auto">
                    Notre équipe analyse votre brief et reviendra vers vous rapidement.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl p-4 border border-primary/15 bg-primary/6">
                    <p className="text-sm font-semibold text-foreground mb-1">{form.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Ce formulaire nous aide à comprendre votre projet, vos attentes et vos préférences.
                      Plus il est complet, plus notre travail sera précis dès le départ.
                    </p>
                  </div>
                  <Link href={`/dashboard/${projectId}/onboarding`} className="hub-btn hub-btn-primary">
                    Remplir le formulaire (5-10 min) <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
        )}

        {/* Documents */}
        <TabsContent value="files">
          <div className="hub-card p-6">
            {!files?.length ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">Aucun document déposé</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Votre équipe déposera ici vos documents, maquettes et factures au fil de l&apos;avancement.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground mb-4">
                  Cliquez sur un fichier pour le télécharger. Liens valables 1 heure.
                </p>
                {files.map((file) => {
                  const Icon = FILE_ICONS[file.category as FileCategory]
                  return (
                    <a
                      key={file.id}
                      href={`/api/client/files/${file.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0 text-muted-foreground group-hover:bg-border transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {FILE_LABELS[file.category as FileCategory]} · {new Date(file.uploaded_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Formation */}
        <TabsContent value="training">
          <div className="space-y-4">
            <div className="hub-card p-6">
              {!videos?.length ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Play className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">Aucune vidéo disponible</p>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-6">
                    Votre équipe ajoutera des vidéos de formation pour vous aider à utiliser votre site.
                  </p>
                  <AiAssistant projectId={projectId} />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {videos.map((video) => (
                      <a
                        key={video.id}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-4 rounded-xl border border-border hover:border-foreground transition-all hover:shadow-sm bg-background"
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary text-primary-foreground">
                          <Play className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate">{video.title}</p>
                          {video.description && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{video.description}</p>
                          )}
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
                      </a>
                    ))}
                  </div>

                  {/* Bloc de conversion inversé, façon vivesmedia.com */}
                  <div className="rounded-2xl bg-foreground p-6">
                    <p className="hub-eyebrow mb-3">Aller plus loin</p>
                    <h3 className="text-lg font-bold text-white mb-2">
                      Faites <span className="hub-accent text-white">rayonner</span> votre visibilité
                    </h3>
                    <p className="text-sm text-white/60 mb-5 leading-relaxed">
                      Ces formations couvrent les bases. Pour maximiser vos résultats — SEO,
                      référencement sur les intelligences artificielles (ChatGPT, Google AI…),
                      publicités ciblées, emails automatisés — nous proposons un accompagnement sur mesure.
                    </p>
                    <Link
                      href="https://vivesmedia.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hub-btn hub-btn-primary hub-btn-sm"
                    >
                      Découvrir nos formules <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {/* Assistant IA — toujours visible dans l'onglet Formation */}
            <AiAssistant projectId={projectId} />
          </div>
        </TabsContent>

        {/* Support */}
        {project.is_maintenance && (
          <TabsContent value="support">
            <div className="hub-card p-6">
              <div className="rounded-xl bg-secondary p-4 mb-5">
                <p className="text-sm font-semibold text-foreground mb-1">Comment fonctionne le support ?</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Décrivez votre demande avec précision. Notre équipe répond sous <strong className="text-foreground">24-48h ouvrées</strong>.
                  Pour les urgences (site hors ligne), choisissez le niveau «&nbsp;Urgent&nbsp;».
                </p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-foreground">
                  {!(tickets as { length: number } | null)?.length ? 'Aucun ticket' : `${(tickets as { length: number }).length} ticket(s)`}
                </p>
                <Link href={`/dashboard/${projectId}/support/new`} className="hub-btn hub-btn-primary hub-btn-sm">
                  <MessageCircle className="w-3.5 h-3.5" />
                  Nouveau ticket
                </Link>
              </div>

              {!(tickets as { length: number } | null)?.length ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Tout fonctionne bien ! Si vous avez une question, créez un ticket.
                </p>
              ) : (
                <div className="space-y-2">
                  {(tickets as { id: string; title: string; status: string; created_at: string }[]).map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                      <div>
                        <p className="text-sm font-medium text-foreground">{ticket.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(ticket.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        ticket.status === 'open' ? 'bg-(--sem-danger-bg) text-(--sem-danger-fg)' :
                        ticket.status === 'in_progress' ? 'bg-(--sem-warn-bg) text-(--sem-warn-fg)' :
                        'bg-(--sem-ok-bg) text-(--sem-ok-fg)'
                      }`}>
                        {ticket.status === 'open' ? 'En attente' : ticket.status === 'in_progress' ? 'En cours' : 'Résolu'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
