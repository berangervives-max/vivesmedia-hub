import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PHASE_LABELS } from '@/types/database'
import type { ProjectPhase } from '@/types/database'

const PHASE_COLORS: Record<ProjectPhase, string> = {
  onboarding: 'bg-blue-50 text-blue-600',
  design: 'bg-purple-50 text-purple-600',
  dev: 'bg-amber-50 text-amber-600',
  recette: 'bg-orange-50 text-orange-600',
  livraison: 'bg-emerald-50 text-emerald-600',
  maintenance: 'bg-secondary text-muted-foreground',
}

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('*, clients(name, email)')
    .order('updated_at', { ascending: false })

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: '#F4521E' }}>
          Suivi
        </p>
        <h1 className="text-2xl font-bold text-foreground">Projets</h1>
        <p className="text-muted-foreground text-sm mt-1">{projects?.length ?? 0} projets au total</p>
      </div>

      {!projects?.length ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <p className="text-muted-foreground text-sm mb-3">Aucun projet. Créez d'abord un client.</p>
          <Link
            href="/admin/clients/new"
            className="text-sm font-medium underline underline-offset-4 text-foreground"
          >
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
                className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between hover:border-primary/30 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold"
                    style={{ backgroundColor: '#F4521E' }}
                  >
                    {client?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{project.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{client?.name} · {client?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${PHASE_COLORS[project.current_phase as ProjectPhase]}`}>
                    {PHASE_LABELS[project.current_phase as ProjectPhase]}
                  </span>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {new Date(project.updated_at).toLocaleDateString('fr-FR')}
                  </p>
                  <span className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors">→</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
