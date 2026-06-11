import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PHASE_LABELS } from '@/types/database'
import type { ProjectPhase } from '@/types/database'

const PHASE_COLORS: Record<ProjectPhase, string> = {
  onboarding: 'bg-blue-100 text-blue-700',
  design: 'bg-purple-100 text-purple-700',
  dev: 'bg-yellow-100 text-yellow-700',
  recette: 'bg-orange-100 text-orange-700',
  livraison: 'bg-green-100 text-green-700',
  maintenance: 'bg-zinc-100 text-zinc-700',
}

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('*, clients(name, email)')
    .order('updated_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Projets</h1>
        <p className="text-zinc-500 text-sm mt-1">{projects?.length ?? 0} projets au total</p>
      </div>

      {!projects?.length ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-100">
          <p className="text-zinc-400 text-sm">Aucun projet. Créez d'abord un client.</p>
          <Link href="/admin/clients/new" className="text-xs text-zinc-900 underline mt-3 inline-block">
            Créer un client →
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {projects.map((project) => {
            const client = Array.isArray(project.clients) ? project.clients[0] : project.clients
            return (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="bg-white rounded-xl border border-zinc-100 p-5 flex items-center justify-between hover:border-zinc-200 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-semibold">
                      {client?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-900 truncate">{project.name}</p>
                    <p className="text-sm text-zinc-400 truncate">{client?.name} · {client?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${PHASE_COLORS[project.current_phase as ProjectPhase]}`}>
                    {PHASE_LABELS[project.current_phase as ProjectPhase]}
                  </span>
                  <p className="text-xs text-zinc-400 hidden sm:block">
                    {new Date(project.updated_at).toLocaleDateString('fr-FR')}
                  </p>
                  <span className="text-zinc-300 group-hover:text-zinc-600 transition-colors">→</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
