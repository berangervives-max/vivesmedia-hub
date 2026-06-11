import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PHASE_LABELS, PHASE_ORDER } from '@/types/database'
import type { ProjectPhase } from '@/types/database'
import { ChevronRight, Rocket, MessageCircle } from 'lucide-react'

const PHASE_COLORS: Record<ProjectPhase, string> = {
  onboarding: 'bg-blue-100 text-blue-700',
  design: 'bg-purple-100 text-purple-700',
  dev: 'bg-yellow-100 text-yellow-700',
  recette: 'bg-orange-100 text-orange-700',
  livraison: 'bg-green-100 text-green-700',
  maintenance: 'bg-zinc-100 text-zinc-700',
}

const PHASE_DESCRIPTIONS: Record<ProjectPhase, string> = {
  onboarding: 'Nous recueillons vos informations pour démarrer le projet',
  design: 'Création des maquettes et de l\'identité visuelle',
  dev: 'Développement technique de votre site',
  recette: 'Tests et vérifications avant la mise en ligne',
  livraison: 'Votre site est en ligne — félicitations !',
  maintenance: 'Suivi, mises à jour et support continu',
}

export default async function ClientDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!client) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
          <Rocket className="w-7 h-7 text-zinc-400" />
        </div>
        <p className="text-lg font-semibold text-zinc-900 mb-2">Votre espace est en préparation</p>
        <p className="text-zinc-500 text-sm max-w-sm mx-auto">
          Votre compte client est en cours de configuration par notre équipe.
          Vous recevrez un email dès que tout est prêt.
        </p>
        <Link
          href="mailto:berangervives@gmail.com"
          className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-zinc-900 hover:underline"
        >
          <MessageCircle className="w-4 h-4" />
          Contacter vivesmedia.com
        </Link>
      </div>
    )
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', client.id)
    .order('created_at', { ascending: false })

  if (projects?.length === 1) {
    redirect(`/dashboard/${projects[0].id}`)
  }

  const firstName = client.name.split(' ')[0]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Bonjour, {firstName} 👋</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Bienvenue dans votre espace projet vivesmedia.com
        </p>
      </div>

      {!projects?.length ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-100">
          <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-5 h-5 text-zinc-400" />
          </div>
          <p className="text-zinc-600 font-medium mb-1">Votre projet arrive bientôt</p>
          <p className="text-zinc-400 text-sm">Notre équipe est en train de préparer votre espace.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4">
            {projects.map((project) => {
              const phase = project.current_phase as ProjectPhase
              const phaseIndex = PHASE_ORDER.indexOf(phase)
              const progress = Math.round(((phaseIndex + 1) / PHASE_ORDER.length) * 100)

              return (
                <Link
                  key={project.id}
                  href={`/dashboard/${project.id}`}
                  className="bg-white rounded-2xl border border-zinc-100 p-6 hover:border-zinc-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="font-semibold text-zinc-900 text-lg">{project.name}</h2>
                      <span className={`inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full ${PHASE_COLORS[phase]}`}>
                        {PHASE_LABELS[phase]}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-600 transition-colors mt-1" />
                  </div>

                  <p className="text-sm text-zinc-400 mb-4">{PHASE_DESCRIPTIONS[phase]}</p>

                  <div>
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                      <span>Avancement global</span>
                      <span className="font-medium text-zinc-600">{progress}%</span>
                    </div>
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-900 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-zinc-400">Démarrage</span>
                      <span className="text-xs text-zinc-400">Livraison</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Upsell : nouveau projet */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 text-white">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Vous avez un nouveau projet ?
            </p>
            <h3 className="text-lg font-semibold mb-2">
              Développons ensemble votre prochaine étape digitale
            </h3>
            <p className="text-sm text-zinc-300 mb-4 leading-relaxed">
              Nouveau site, boutique en ligne, refonte, SEO ou maintenance — nous avons une formule adaptée à votre besoin et votre budget.
            </p>
            <Link
              href="https://vivesmedia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-zinc-900 text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-zinc-100 transition-colors"
            >
              Voir nos offres →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
