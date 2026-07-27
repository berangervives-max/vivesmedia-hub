import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PHASE_LABELS } from '@/lib/phases'
import type { ProjectPhase } from '@/types/database'
import { ChevronRight } from 'lucide-react'

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('*, clients(name, email)')
    .order('updated_at', { ascending: false })

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <div className="mb-7">
        <p className="hub-eyebrow">Suivi</p>
        <h1 className="text-2xl font-bold text-foreground mt-1.5">Projets</h1>
        <p className="text-muted-foreground text-sm mt-1">{projects?.length ?? 0} projets au total</p>
      </div>

      {!projects?.length ? (
        <div className="text-center py-16 hub-card">
          <p className="text-muted-foreground text-sm mb-3">Aucun projet. Créez d&apos;abord un client.</p>
          <Link
            href="/admin/clients/new"
            className="text-sm font-semibold text-primary underline underline-offset-4"
          >
            Créer un client →
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {projects.map((project) => {
            const client = Array.isArray(project.clients) ? project.clients[0] : project.clients
            const phase = project.current_phase as ProjectPhase
            return (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="hub-card p-5 flex items-center justify-between hover:border-primary/30 hover:shadow-(--hub-shadow) transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary text-primary-foreground text-sm font-bold">
                    {client?.name?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{project.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      <span className="hub-accent text-foreground/80">{client?.name}</span>
                      {client?.email ? ` · ${client.email}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span className="phase-badge" data-phase={phase}>
                    {PHASE_LABELS[phase]}
                  </span>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {new Date(project.updated_at).toLocaleDateString('fr-FR')}
                  </p>
                  <ChevronRight className="w-4 h-4 text-border group-hover:text-muted-foreground transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
