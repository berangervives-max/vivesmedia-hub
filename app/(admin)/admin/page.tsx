import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PHASE_LABELS } from '@/types/database'
import type { ProjectPhase } from '@/types/database'
import { Users, FolderOpen, AlertCircle, CheckCircle2 } from 'lucide-react'

const PHASE_COLORS: Record<ProjectPhase, string> = {
  onboarding: 'bg-blue-100 text-blue-700',
  design: 'bg-purple-100 text-purple-700',
  dev: 'bg-yellow-100 text-yellow-700',
  recette: 'bg-orange-100 text-orange-700',
  livraison: 'bg-green-100 text-green-700',
  maintenance: 'bg-zinc-100 text-zinc-700',
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
    { label: 'Clients', value: clients?.length ?? 0, icon: Users },
    { label: 'Projets actifs', value: projects?.filter(p => p.current_phase !== 'maintenance').length ?? 0, icon: FolderOpen },
    { label: 'Tickets ouverts', value: tickets?.length ?? 0, icon: AlertCircle },
    { label: 'Livrés', value: projects?.filter(p => p.current_phase === 'livraison' || p.current_phase === 'maintenance').length ?? 0, icon: CheckCircle2 },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1">Vue d'ensemble de tous vos projets client</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-zinc-500">{label}</p>
                <Icon className="w-4 h-4 text-zinc-400" />
              </div>
              <p className="text-3xl font-bold text-zinc-900">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projets récents */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Projets en cours</CardTitle>
            <Link
              href="/admin/projects"
              className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              Voir tout →
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {!projects?.length ? (
            <p className="text-sm text-zinc-400 py-4 text-center">
              Aucun projet pour l'instant.{' '}
              <Link href="/admin/clients/new" className="underline">
                Créer un client
              </Link>
            </p>
          ) : (
            <div className="space-y-1">
              {projects.map((project) => {
                const client = Array.isArray(project.clients) ? project.clients[0] : project.clients
                return (
                  <Link
                    key={project.id}
                    href={`/admin/projects/${project.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-semibold">
                          {client?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-900 truncate">{project.name}</p>
                        <p className="text-xs text-zinc-400 truncate">{client?.email}</p>
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
        </CardContent>
      </Card>
    </div>
  )
}
