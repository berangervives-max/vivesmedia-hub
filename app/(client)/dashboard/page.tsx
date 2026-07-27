import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PHASE_LABELS, PHASE_DESCRIPTIONS, phaseProgress } from '@/lib/phases'
import type { ProjectPhase } from '@/types/database'
import { createClient } from '@/lib/supabase/server'
import { ChevronRight, Rocket, ArrowUpRight } from 'lucide-react'

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
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-primary/8">
          <Rocket className="w-7 h-7 text-primary" />
        </div>
        <p className="text-lg font-bold text-foreground mb-2">Votre espace est en préparation</p>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
          Votre compte client est en cours de configuration par notre équipe.
          Vous recevrez un email dès que tout est prêt.
        </p>
        <Link
          href="mailto:berangervives@gmail.com"
          className="hub-btn hub-btn-primary mt-6"
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
        <p className="hub-eyebrow">Espace client</p>
        <h1 className="text-3xl font-bold text-foreground mt-1.5">
          Bonjour, <span className="hub-accent">{firstName}</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1.5">
          Retrouvez ici l&apos;avancement de vos projets vivesmedia.com
        </p>
      </div>

      {!projects?.length ? (
        <div className="text-center py-16 hub-card">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-primary/8">
            <Rocket className="w-5 h-5 text-primary" />
          </div>
          <p className="text-foreground font-semibold mb-1">Votre projet arrive bientôt</p>
          <p className="text-muted-foreground text-sm">Notre équipe est en train de préparer votre espace.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4">
            {projects.map((project) => {
              const phase = project.current_phase as ProjectPhase
              const progress = phaseProgress(phase)

              return (
                <Link
                  key={project.id}
                  href={`/dashboard/${project.id}`}
                  className="hub-card p-6 hover:border-primary/30 hover:shadow-(--hub-shadow) transition-all group block"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="font-bold text-foreground text-xl">{project.name}</h2>
                      <span className="phase-badge mt-2" data-phase={phase}>
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
                        className="h-full rounded-full bg-linear-to-r from-primary to-[#FF7A45] transition-all duration-500"
                        style={{ width: `${progress}%` }}
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

          {/* Bloc de conversion inversé, façon vivesmedia.com */}
          <div className="bg-foreground rounded-2xl p-6 text-white">
            <p className="hub-eyebrow mb-2">Nouveau projet ?</p>
            <h3 className="text-xl font-bold mb-2">
              Développons ensemble votre <span className="hub-accent text-white">prochaine étape</span>
            </h3>
            <p className="text-sm text-white/60 mb-5 leading-relaxed">
              Nouveau site, boutique en ligne, refonte, SEO ou maintenance — nous avons une formule adaptée à votre besoin et votre budget.
            </p>
            <Link
              href="https://vivesmedia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hub-btn hub-btn-primary hub-btn-sm"
            >
              Voir nos offres <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
