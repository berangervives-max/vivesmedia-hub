import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PHASE_LABELS } from '@/lib/phases'
import type { ProjectPhase } from '@/types/database'
import { Users, FolderOpen, AlertCircle, CheckCircle2, Plus, ChevronRight } from 'lucide-react'

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

  const activeCount = projects?.filter((p) => p.current_phase !== 'maintenance').length ?? 0
  const deliveredCount =
    projects?.filter((p) => p.current_phase === 'livraison' || p.current_phase === 'maintenance').length ?? 0

  const stats = [
    { label: 'Clients', value: clients?.length ?? 0, icon: Users, note: 'au total', accent: false },
    { label: 'Projets actifs', value: activeCount, icon: FolderOpen, note: 'en cours', accent: true },
    { label: 'Tickets ouverts', value: tickets?.length ?? 0, icon: AlertCircle, note: 'à traiter', accent: false },
    { label: 'Sites livrés', value: deliveredCount, icon: CheckCircle2, note: 'en ligne', accent: false },
  ]

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      {/* En-tête */}
      <header className="flex items-start justify-between gap-4 flex-wrap mb-7">
        <div>
          <p className="hub-eyebrow">vivesmedia.com</p>
          <h1 className="text-[2rem] font-bold text-foreground mt-1.5">
            Bonjour, <span className="hub-accent">Béranger.</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1 first-letter:uppercase">
            Vue d&apos;ensemble de vos projets client — {today}
          </p>
        </div>
        <Link href="/admin/clients/new" className="hub-btn hub-btn-primary">
          <Plus className="w-4 h-4" />
          Nouveau client
        </Link>
      </header>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {stats.map(({ label, value, icon: Icon, note, accent }) => (
          <div
            key={label}
            className={`rounded-2xl border p-5 transition-shadow hover:shadow-(--hub-shadow) ${
              accent ? 'border-primary/20 bg-primary/6' : 'border-border bg-card'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className={`w-4 h-4 ${accent ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <p className={`text-[2.4rem] leading-none font-bold tracking-tighter ${accent ? 'text-primary' : 'text-foreground'}`}>
              {value}
            </p>
            <p className="text-xs text-muted-foreground mt-2">{note}</p>
          </div>
        ))}
      </div>

      {/* Projets en cours */}
      <div className="hub-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-bold text-foreground">Projets en cours</h2>
          <Link
            href="/admin/projects"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Voir tout →
          </Link>
        </div>
        <div className="p-2">
          {!projects?.length ? (
            <p className="text-sm text-muted-foreground py-10 text-center">
              Aucun projet pour l&apos;instant.{' '}
              <Link href="/admin/clients/new" className="text-primary underline underline-offset-4">
                Créer un client
              </Link>
            </p>
          ) : (
            <div className="space-y-0.5">
              {projects.map((project) => {
                const client = Array.isArray(project.clients) ? project.clients[0] : project.clients
                const phase = project.current_phase as ProjectPhase
                return (
                  <Link
                    key={project.id}
                    href={`/admin/projects/${project.id}`}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-secondary transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-primary text-primary-foreground text-sm font-bold">
                      {client?.name?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">{project.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        <span className="hub-accent text-foreground/80">{client?.name}</span>
                        {client?.email ? <span className="text-muted-foreground"> · {client.email}</span> : null}
                      </p>
                    </div>
                    <span className="phase-badge shrink-0" data-phase={phase}>
                      {PHASE_LABELS[phase]}
                    </span>
                    <ChevronRight className="w-4 h-4 text-border shrink-0 group-hover:text-muted-foreground transition-colors" />
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
