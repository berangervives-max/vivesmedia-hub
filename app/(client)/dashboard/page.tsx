import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PHASE_LABELS, PHASE_ORDER } from '@/types/database'
import type { ProjectPhase } from '@/types/database'
import { ChevronRight } from 'lucide-react'

const PHASE_COLORS: Record<ProjectPhase, string> = {
  onboarding: 'bg-blue-100 text-blue-700',
  design: 'bg-purple-100 text-purple-700',
  dev: 'bg-yellow-100 text-yellow-700',
  recette: 'bg-orange-100 text-orange-700',
  livraison: 'bg-green-100 text-green-700',
  maintenance: 'bg-zinc-100 text-zinc-700',
}

export default async function ClientDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Get client record
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400">Votre compte est en cours de configuration.</p>
        <p className="text-zinc-400 text-sm mt-2">Contactez votre équipe vivesmedia.com.</p>
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Bonjour, {client.name.split(' ')[0]} 👋</h1>
        <p className="text-zinc-500 text-sm mt-1">Vos projets en cours</p>
      </div>

      {!projects?.length ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-100">
          <p className="text-zinc-400">Votre espace projet est en préparation.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => {
            const phaseIndex = PHASE_ORDER.indexOf(project.current_phase as ProjectPhase)
            const progress = Math.round(((phaseIndex + 1) / PHASE_ORDER.length) * 100)

            return (
              <Link
                key={project.id}
                href={`/dashboard/${project.id}`}
                className="bg-white rounded-2xl border border-zinc-100 p-6 hover:border-zinc-200 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-semibold text-zinc-900">{project.name}</h2>
                    <span className={`inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full ${PHASE_COLORS[project.current_phase as ProjectPhase]}`}>
                      {PHASE_LABELS[project.current_phase as ProjectPhase]}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-600 transition-colors mt-1" />
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                    <span>Progression</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
