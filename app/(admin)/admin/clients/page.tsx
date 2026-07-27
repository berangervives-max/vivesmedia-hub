import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PHASE_LABELS } from '@/lib/phases'
import type { ProjectPhase } from '@/types/database'
import { Plus } from 'lucide-react'

export default async function ClientsPage() {
  const supabase = await createClient()

  const { data: clients } = await supabase
    .from('clients')
    .select('*, projects(id, name, current_phase)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-7">
        <div>
          <p className="hub-eyebrow">Gestion</p>
          <h1 className="text-2xl font-bold text-foreground mt-1.5">Clients</h1>
          <p className="text-muted-foreground text-sm mt-1">{clients?.length ?? 0} clients au total</p>
        </div>
        <Link href="/admin/clients/new" className="hub-btn hub-btn-primary">
          <Plus className="w-4 h-4" />
          Nouveau client
        </Link>
      </div>

      {!clients?.length ? (
        <div className="text-center py-16 hub-card">
          <p className="text-muted-foreground text-sm mb-4">Aucun client pour l&apos;instant.</p>
          <Link href="/admin/clients/new" className="hub-btn hub-btn-primary hub-btn-sm">
            <Plus className="w-4 h-4" />
            Créer le premier client
          </Link>
        </div>
      ) : (
        <div className="hub-card overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-border bg-secondary/60">
                <th className="text-left text-[0.7rem] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Client</th>
                <th className="text-left text-[0.7rem] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Email</th>
                <th className="text-left text-[0.7rem] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Entreprise</th>
                <th className="text-left text-[0.7rem] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Projets</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-primary text-primary-foreground text-xs font-bold">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-foreground">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-muted-foreground">{client.email}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-muted-foreground">{client.company ?? '—'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {(client.projects as unknown as { id: string; name: string; current_phase: ProjectPhase }[] | null)?.map((p) => (
                        <span key={p.id} className="phase-badge" data-phase={p.current_phase} title={PHASE_LABELS[p.current_phase]}>
                          {p.name}
                        </span>
                      )) ?? <span className="text-xs text-muted-foreground">Aucun projet</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                    >
                      Gérer →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
