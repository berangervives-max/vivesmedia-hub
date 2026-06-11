import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { PHASE_LABELS, PHASE_ORDER } from '@/types/database'
import type { Database, ProjectPhase, FileCategory } from '@/types/database'
import { FileText, Image, Receipt, Play, ArrowLeft, ChevronRight, Lightbulb, MessageCircle } from 'lucide-react'

const PHASE_COLORS: Record<ProjectPhase, string> = {
  onboarding: 'bg-blue-100 text-blue-700',
  design: 'bg-purple-100 text-purple-700',
  dev: 'bg-yellow-100 text-yellow-700',
  recette: 'bg-orange-100 text-orange-700',
  livraison: 'bg-green-100 text-green-700',
  maintenance: 'bg-zinc-100 text-zinc-700',
}

const PHASE_DESCRIPTIONS: Record<ProjectPhase, string> = {
  onboarding: 'Nous recueillons vos informations pour démarrer',
  design: 'Création des maquettes et de l\'identité visuelle',
  dev: 'Développement technique de votre site',
  recette: 'Tests et vérifications avant mise en ligne',
  livraison: '🎉 Votre site est en ligne !',
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
            <span className={`inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full ${PHASE_COLORS[phase]}`}>
              {PHASE_LABELS[phase]}
            </span>
          </div>
        </div>
        <p className="text-sm text-zinc-400 mb-5">{PHASE_DESCRIPTIONS[phase]}</p>

        {/* Phase timeline */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
          <span>Avancement global</span>
          <span className="font-medium text-zinc-600">{progress}%</span>
        </div>
        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-zinc-900 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {PHASE_ORDER.map((p, index) => (
            <div key={p} className="flex items-center gap-1">
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                index < phaseIndex ? 'bg-zinc-900 text-white' :
                index === phaseIndex ? 'bg-zinc-900 text-white ring-2 ring-zinc-200' :
                'bg-zinc-100 text-zinc-400'
              }`}>
                {index < phaseIndex ? '✓' : ''}
              </div>
              <span className={`text-xs ${index === phaseIndex ? 'text-zinc-900 font-medium' : 'text-zinc-400'}`}>
                {PHASE_LABELS[p]}
              </span>
              {index < PHASE_ORDER.length - 1 && (
                <ChevronRight className="w-2.5 h-2.5 text-zinc-200" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action requise (formulaire onboarding non rempli) */}
      {hasOnboardingAction && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-600 text-sm">!</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900">Action requise : formulaire de démarrage</p>
              <p className="text-xs text-blue-700 mt-1 mb-3">
                Pour que nous puissions démarrer votre projet, merci de compléter le formulaire d'onboarding. Cela prend 5 à 10 minutes.
              </p>
              <Link href={`/dashboard/${projectId}/onboarding`}>
                <span className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                  Remplir le formulaire →
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue={hasOnboardingAction ? 'onboarding' : 'files'}>
        <TabsList className="mb-6">
          {form && (
            <TabsTrigger value="onboarding" className="gap-2">
              Onboarding
              {!formResponse?.is_complete && (
                <span className="w-2 h-2 rounded-full bg-red-500" />
              )}
            </TabsTrigger>
          )}
          <TabsTrigger value="files">
            Documents {files?.length ? `(${files.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="training">
            Formation {videos?.length ? `(${videos.length})` : ''}
          </TabsTrigger>
          {project.is_maintenance && (
            <TabsTrigger value="support">
              Support {(tickets as { length?: number } | null)?.length ? `(${(tickets as { length: number }).length})` : ''}
            </TabsTrigger>
          )}
        </TabsList>

        {form && (
          <TabsContent value="onboarding">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                {formResponse?.is_complete ? (
                  <div className="text-center py-6">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 text-lg">✓</span>
                    </div>
                    <p className="text-sm font-semibold text-zinc-900">Formulaire complété !</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Envoyé le {new Date(formResponse.submitted_at!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-zinc-500 mt-3">
                      Nous avons bien reçu vos informations. Notre équipe analyse votre brief et reviendra vers vous rapidement.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-sm font-semibold text-blue-900 mb-1">{form.title}</p>
                      <p className="text-xs text-blue-700">
                        Ce formulaire nous aide à comprendre votre projet, vos attentes et vos préférences.
                        Plus il est complet, plus notre travail sera précis dès le départ.
                      </p>
                    </div>
                    <Link href={`/dashboard/${projectId}/onboarding`}>
                      <span className="inline-flex items-center gap-2 bg-zinc-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-zinc-700 transition-colors">
                        Remplir le formulaire (5-10 min) →
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
                <div className="text-center py-8">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-5 h-5 text-zinc-400" />
                  </div>
                  <p className="text-sm font-medium text-zinc-600 mb-1">Aucun document déposé</p>
                  <p className="text-xs text-zinc-400">
                    Votre équipe déposera ici vos documents, maquettes et factures au fur et à mesure de l'avancement.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-zinc-400 mb-4">
                    Cliquez sur un fichier pour le télécharger. Les liens sont valables 1 heure.
                  </p>
                  {files.map((file) => {
                    const Icon = FILE_ICONS[file.category as FileCategory]
                    return (
                      <a
                        key={file.id}
                        href={`/api/client/files/${file.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 transition-colors group border border-transparent hover:border-zinc-100"
                      >
                        <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-zinc-200 transition-colors">
                          <Icon className="w-4 h-4 text-zinc-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-900 truncate">{file.name}</p>
                          <p className="text-xs text-zinc-400">
                            {FILE_LABELS[file.category as FileCategory]} · {new Date(file.uploaded_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <span className="text-xs text-zinc-400 group-hover:text-zinc-600 shrink-0">
                          Ouvrir →
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
                <div className="text-center py-8">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-3">
                    <Play className="w-5 h-5 text-zinc-400" />
                  </div>
                  <p className="text-sm font-medium text-zinc-600 mb-1">Aucune vidéo disponible</p>
                  <p className="text-xs text-zinc-400">
                    Votre équipe ajoutera des vidéos de formation pour vous aider à utiliser votre site.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {videos.map((video) => (
                      <a
                        key={video.id}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block bg-zinc-50 rounded-xl p-4 hover:bg-zinc-100 transition-colors border border-transparent hover:border-zinc-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0 group-hover:bg-zinc-700 transition-colors">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-zinc-900 truncate">{video.title}</p>
                            {video.description && (
                              <p className="text-xs text-zinc-400 truncate mt-0.5">{video.description}</p>
                            )}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* Upsell sous les vidéos */}
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-amber-900 mb-1">
                          Envie d'aller plus loin ?
                        </p>
                        <p className="text-sm text-amber-800 mb-3 leading-relaxed">
                          Ces formations couvrent les bases. Pour maximiser vos résultats — référencement naturel (SEO),
                          référencement sur les intelligences artificielles (ChatGPT, Google AI…), publicités, emails
                          automatisés — nous proposons un accompagnement sur mesure.
                        </p>
                        <Link
                          href="https://vivesmedia.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-900 transition-colors"
                        >
                          Découvrir nos formules →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {project.is_maintenance && (
          <TabsContent value="support">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="bg-zinc-50 rounded-xl p-4 mb-5">
                  <p className="text-sm font-semibold text-zinc-900 mb-1">
                    Comment fonctionne le support ?
                  </p>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Décrivez votre demande avec le plus de détails possible. Notre équipe vous répond sous <strong>24-48h ouvrées</strong>.
                    Pour les urgences (site hors ligne, bug bloquant), indiquez le niveau d'urgence "Urgent".
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-zinc-700">
                    {!(tickets as { length: number } | null)?.length
                      ? 'Aucun ticket ouvert'
                      : `${(tickets as { length: number }).length} ticket(s)`}
                  </p>
                  <Link href={`/dashboard/${projectId}/support/new`}>
                    <span className="flex items-center gap-1.5 text-xs bg-zinc-900 text-white px-3 py-2 rounded-lg hover:bg-zinc-700 transition-colors">
                      <MessageCircle className="w-3.5 h-3.5" />
                      Nouveau ticket
                    </span>
                  </Link>
                </div>

                {!(tickets as { length: number } | null)?.length ? (
                  <p className="text-sm text-zinc-400 text-center py-4">
                    Tout fonctionne bien ! Si vous avez une question ou un problème, créez un ticket.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {(tickets as { id: string; title: string; status: string; created_at: string; priority: string }[]).map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                        <div>
                          <p className="text-sm font-medium text-zinc-900">{ticket.title}</p>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Ouvert le {new Date(ticket.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                          </p>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                          ticket.status === 'open' ? 'bg-red-100 text-red-700' :
                          ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {ticket.status === 'open' ? 'En attente' :
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
