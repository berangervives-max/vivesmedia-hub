import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PHASE_LABELS } from '@/types/database'
import type { ProjectPhase } from '@/types/database'
import { Users, FolderOpen, AlertCircle, CheckCircle2 } from 'lucide-react'

const PHASE_COLORS: Record<ProjectPhase, string> = {
  onboarding: 'bg-blue-50 text-blue-600',
  design: 'bg-purple-50 text-purple-600',
  dev: 'bg-amber-50 text-amber-600',
  recette: 'bg-orange-50 text-orange-600',
  livraison: 'bg-emerald-50 text-emerald-600',
  maintenance: 'bg-secondary text-muted-foreground',
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ data: clients }, { data: projects }, { data: tickets }] =
    await Promise.all([
      supabase.from('clients').select('id'),
      supabase
        .from('projects')
        .select('id, name, current_phase, updated_at, clients(name, email)')
        .order('updated_at', { ascending: false }),
      supabase.from('tickets').select('id, status').eq('status', 'open'),
    ])

  const stats = [
    { label: 'Clients', value: clients?.length ?? 0, icon: Users, accent: false },
    { label: 'Projets actifs', value: projects?.filter(p => p.current_phase !== 'maintenance').length ?? 0, icon: FolderOpen, accent: true },
    { label: 'Tickets ouverts', value: tickets?.length ?? 0, icon: AlertCircle, accent: false },
    { label: 'Livrés', value: projects?.filter(p => p.current_phase === 'livraison' || p.current_phase === 'maintenance').length ?? 0, icon: CheckCircle2, accent: false },
  ]

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: '#F4521E' }}>
          vivesmedia.com
        </p>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Vue d'ensemble de tous vos projets client</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className="rounded-2xl border border-border p-5 bg-card"
            style={accent ? { borderColor: 'rgba(244,82,30,0.2)', backgroundColor: 'rgba(244,82,30,0.04)' } : {}}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon
                className="w-4 h-4"
                style={{ color: accent ? '#F4521E' : undefined }}
              />
            </div>
            <p
              className="text-3xl font-bold"
              style={{ color: accent ? '#F4521E' : undefined }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Projets récents */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Projets en cours</h2>
          <Link
            href="/admin/projects"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Voir tout →
          </Link>
        </div>
        <div className="p-2">
          {!projects?.length ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Aucun projet pour l'instant.{' '}
              <Link href="/admin/clients/new" className="underline underline-offset-4">
                Créer un client
              </Link>
            </p>
          ) : (
            <div className="space-y-0.5">
              {projects.map((project) => {
                const client = Array.isArray(project.clients) ? project.clients[0] : project.clients
                return (
                  <Link
                    key={project.id}
                    href={`/admin/projects/${project.id}`}
                    className="flex items-center justify-between p-3.5 rounded-xl hover:bg-secondary transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                        style={{ backgroundColor: '#F4521E' }}
                      >
                        {client?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{client?.email}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ml-4 ${PHASE_COLORS[project.current_phase as ProjectPhase]}`}
                    >
                      {PHASE_LABELS[project.current_phase as ProjectPhase]}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
