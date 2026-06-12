import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PHASE_LABELS, PHASE_ORDER } from '@/types/database'
import type { ProjectPhase } from '@/types/database'
import { ChevronRight, Rocket, ArrowUpRight } from 'lucide-react'

const PHASE_COLORS: Record<ProjectPhase, string> = {
  onboarding: 'bg-blue-50 text-blue-600 border border-blue-100',
  design: 'bg-purple-50 text-purple-600 border border-purple-100',
  dev: 'bg-amber-50 text-amber-600 border border-amber-100',
  recette: 'bg-orange-50 text-orange-600 border border-orange-100',
  livraison: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  maintenance: 'bg-secondary text-muted-foreground border border-border',
}

const PHASE_DESCRIPTIONS: Record<ProjectPhase, string> = {
  onboarding: 'Nous recueillons vos informations pour démarrer le projet',
  design: "Création des maquettes et de l'identité visuelle",
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
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: 'rgba(244,82,30,0.08)' }}
        >
          <Rocket className="w-7 h-7" style={{ color: '#F4521E' }} />
        </div>
        <p className="text-lg font-bold text-foreground mb-2">Votre espace est en préparation</p>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
          Votre compte client est en cours de configuration par notre équipe.
          Vous recevrez un email dès que tout est prêt.
        </p>
        <Link
          href="mailto:berangervives@gmail.com"
          className="inline-flex items-center gap-2 mt-6 text-sm font-semibold px-6 py-2.5 rounded-full text-white hover:opacity-90 transition-all"
          style={{ backgroundColor: '#F4521E' }}
        >
          Contacter vivesmedia.com <ArrowUpRight className="w-3.5 h-3.5" />
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
        <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: '#F4521E' }}>
          Espace client
        </p>
        <h1 className="text-3xl font-bold text-foreground">
          Bonjour, <span className="font-heading italic font-normal">{firstName}</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1.5">
          Retrouvez ici l'avancement de vos projets vivesmedia.com
        </p>
      </div>

      {!projects?.length ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(244,82,30,0.08)' }}
          >
            <Rocket className="w-5 h-5" style={{ color: '#F4521E' }} />
          </div>
          <p className="text-foreground font-semibold mb-1">Votre projet arrive bientôt</p>
          <p className="text-muted-foreground text-sm">Notre équipe est en train de préparer votre espace.</p>
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
                  className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all group block"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="font-bold text-foreground text-xl">{project.name}</h2>
                      <span className={`inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full ${PHASE_COLORS[phase]}`}>
                        {PHASE_LABELS[phase]}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors mt-1" />
                  </div>

                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{PHASE_DESCRIPTIONS[phase]}</p>

                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Avancement global</span>
                      <span className="font-semibold text-foreground">{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%`, backgroundColor: '#F4521E' }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">Démarrage</span>
                      <span className="text-xs text-muted-foreground">Livraison</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Upsell block — dark bg comme vivesmedia.com */}
          <div className="bg-foreground rounded-2xl p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: '#F4521E' }}>
              Nouveau projet ?
            </p>
            <h3 className="text-xl font-bold mb-2">
              Développons ensemble votre prochaine étape digitale
            </h3>
            <p className="text-sm text-white/60 mb-5 leading-relaxed">
              Nouveau site, boutique en ligne, refonte, SEO ou maintenance — nous avons une formule adaptée à votre besoin et votre budget.
            </p>
            <Link
              href="https://vivesmedia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-full text-white hover:opacity-90 transition-all"
              style={{ backgroundColor: '#F4521E' }}
            >
              Voir nos offres <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
