import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PHASE_LABELS, PHASE_ORDER } from '@/types/database'
import type { Database, ProjectPhase, FileCategory } from '@/types/database'
import { FileText, Image, Receipt, Play, ArrowLeft, ChevronRight, ArrowUpRight, MessageCircle, AlertCircle } from 'lucide-react'
import AiAssistant from '@/components/client/AiAssistant'

const PHASE_COLORS: Record<ProjectPhase, string> = {
  onboarding: 'bg-blue-50 text-blue-700 border-blue-200',
  design: 'bg-purple-50 text-purple-700 border-purple-200',
  dev: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  recette: 'bg-orange-50 text-orange-700 border-orange-200',
  livraison: 'bg-green-50 text-green-700 border-green-200',
  maintenance: 'bg-secondary text-muted-foreground border-border',
}

const PHASE_DESCRIPTIONS: Record<ProjectPhase, string> = {
  onboarding: 'Nous recueillons vos informations pour démarrer',
  design: 'Création des maquettes et de l\'identité visuelle',
  dev: 'Développement technique de votre site',
  recette: 'Tests et vérifications avant mise en ligne',
  livraison: 'Votre site est en ligne — félicitations !',
  maintenance: 'Suivi, mises à jour et support technique',
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
  const phaseIndex = PHASE_ORDER.indexOf(phase)
  const progress = Math.round(((phaseIndex + 1) / PHASE_ORDER.length) * 100)
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

      {/* Project header card */}
      <div className="bg-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">{project.name}</h1>
            <span className={`inline-flex items-center mt-2 text-xs font-semibold px-3 py-1 rounded-full border ${PHASE_COLORS[phase]}`}>
              {PHASE_LABELS[phase]}
            </span>
          </div>
          {phase === 'livraison' && (
            <span className="text-2xl">🎉</span>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-5">{PHASE_DESCRIPTIONS[phase]}</p>

        {/* Progress bar */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>Avancement global</span>
          <span className="font-semibold text-foreground">{progress}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden mb-5">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: '#F4521E' }}
          />
        </div>

        {/* Phase timeline */}
        <div className="flex items-center gap-0.5 flex-wrap">
          {PHASE_ORDER.map((p, index) => (
            <div key={p} className="flex items-center gap-0.5">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                index < phaseIndex
                  ? 'text-muted-foreground'
                  : index === phaseIndex
                  ? 'text-white font-semibold'
                  : 'text-muted-foreground/50'
              }`}
                style={index === phaseIndex ? { backgroundColor: '#F4521E' } : {}}>
                {index < phaseIndex && <span className="text-[10px]">✓</span>}
                {PHASE_LABELS[p]}
              </div>
              {index < PHASE_ORDER.length - 1 && (
                <ChevronRight className="w-3 h-3 text-border shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action requise banner */}
      {hasOnboardingAction && (
        <div className="rounded-2xl border p-5 mb-6" style={{ backgroundColor: 'rgba(244,82,30,0.04)', borderColor: 'rgba(244,82,30,0.2)' }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(244,82,30,0.1)' }}>
              <AlertCircle className="w-4 h-4" style={{ color: '#F4521E' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Action requise : formulaire de démarrage</p>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                Pour démarrer votre projet, merci de compléter le formulaire d'onboarding. Cela prend 5 à 10 minutes.
              </p>
              <Link href={`/dashboard/${projectId}/onboarding`}>
                <span className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#F4521E' }}>
                  Remplir le formulaire <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue={hasOnboardingAction ? 'onboarding' : 'files'}>
        <TabsList className="mb-6 bg-secondary rounded-xl p-1">
          {form && (
            <TabsTrigger value="onboarding" className="rounded-lg gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Onboarding
              {!formResponse?.is_complete && (
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#F4521E' }} />
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
            <div className="bg-card rounded-2xl border border-border p-6">
              {formResponse?.is_complete ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: 'rgba(34,197,94,0.1)' }}>
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                  <p className="text-base font-bold text-foreground">Formulaire complété !</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Envoyé le {new Date(formResponse.submitted_at!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-4 max-w-xs mx-auto">
                    Notre équipe analyse votre brief et reviendra vers vous rapidement.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(244,82,30,0.04)', border: '1px solid rgba(244,82,30,0.15)' }}>
                    <p className="text-sm font-semibold text-foreground mb-1">{form.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Ce formulaire nous aide à comprendre votre projet, vos attentes et vos préférences.
                      Plus il est complet, plus notre travail sera précis dès le départ.
                    </p>
                  </div>
                  <Link href={`/dashboard/${projectId}/onboarding`}>
                    <span className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-all"
                      style={{ backgroundColor: '#F4521E' }}>
                      Remplir le formulaire (5-10 min) <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>
        )}

        {/* Documents */}
        <TabsContent value="files">
          <div className="bg-card rounded-2xl border border-border p-6">
            {!files?.length ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">Aucun document déposé</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Votre équipe déposera ici vos documents, maquettes et factures au fil de l'avancement.
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
                      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-border transition-colors">
                        <Icon className="w-4 h-4 text-muted-foreground" />
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
          <div className="bg-card rounded-2xl border border-border p-6">
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
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all"
                        style={{ backgroundColor: '#F4521E' }}>
                        <Play className="w-4 h-4 text-white" />
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

                {/* Upsell block — dark inverted card like vivesmedia.com */}
                <div className="rounded-2xl bg-foreground p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: '#F4521E' }}>
                    Aller plus loin
                  </p>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Boostez votre visibilité en ligne
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
                    className="inline-flex items-center gap-2 text-foreground text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-all"
                    style={{ backgroundColor: '#F4521E' }}
                  >
                    Découvrir nos formules <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
          {/* IA Assistant — always visible in Formation tab */}
          <AiAssistant projectId={projectId} />
          </div>
        </TabsContent>

        {/* Support */}
        {project.is_maintenance && (
          <TabsContent value="support">
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="rounded-xl bg-secondary p-4 mb-5">
                <p className="text-sm font-semibold text-foreground mb-1">Comment fonctionne le support ?</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Décrivez votre demande avec précision. Notre équipe répond sous <strong className="text-foreground">24-48h ouvrées</strong>.
                  Pour les urgences (site hors ligne), choisissez le niveau "Urgent".
                </p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-foreground">
                  {!(tickets as { length: number } | null)?.length ? 'Aucun ticket' : `${(tickets as { length: number }).length} ticket(s)`}
                </p>
                <Link href={`/dashboard/${projectId}/support/new`}>
                  <span className="inline-flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-all"
                    style={{ backgroundColor: '#F4521E' }}>
                    <MessageCircle className="w-3.5 h-3.5" />
                    Nouveau ticket
                  </span>
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
                        ticket.status === 'open' ? 'bg-red-100 text-red-700' :
                        ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
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
