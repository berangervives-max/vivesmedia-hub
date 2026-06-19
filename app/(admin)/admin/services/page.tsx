import { createAdminClient } from '@/lib/supabase/admin'
import { Euro, ShoppingCart, FileText, TrendingUp } from 'lucide-react'

export const metadata = { title: 'Services & KPI — Hub Admin' }
export const dynamic = 'force-dynamic'

type Commande = { service: string | null; montant: number | null; statut: string | null; created_at: string }
type Devis = { service: string | null; statut: string | null }
type SiteService = { nom: string; prix: number | null; prix_mensuel: number | null; categorie: string | null; actif: boolean }

const euro = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n || 0)

export default async function AdminServicesPage() {
  const admin = createAdminClient()

  const [commandesRes, devisRes, servicesRes] = await Promise.all([
    admin.from('commandes').select('service, montant, statut, created_at'),
    admin.from('devis').select('service, statut'),
    admin.from('site_services').select('nom, prix, prix_mensuel, categorie, actif').order('ordre', { ascending: true }),
  ])

  const commandes = (commandesRes.data ?? []) as unknown as Commande[]
  const devis = (devisRes.data ?? []) as unknown as Devis[]
  const services = (servicesRes.data ?? []) as unknown as SiteService[]

  const paid = commandes.filter((c) => c.statut === 'paye')
  const caTotal = paid.reduce((s, c) => s + Number(c.montant || 0), 0)
  const devisAcceptes = devis.filter((d) => d.statut === 'accepte').length
  const conversion = devis.length ? Math.round((devisAcceptes / devis.length) * 100) : 0
  const panierMoyen = paid.length ? Math.round(caTotal / paid.length) : 0

  const kpis = [
    { label: 'CA encaissé', value: euro(caTotal), icon: Euro, accent: true },
    { label: 'Commandes payées', value: String(paid.length), icon: ShoppingCart, accent: false },
    { label: 'Devis reçus', value: String(devis.length), icon: FileText, accent: false },
    { label: 'Conversion devis', value: `${conversion}%`, icon: TrendingUp, accent: false },
  ]

  // Agrégation par service (clé = nom du service, champ texte libre)
  type Row = { nom: string; ca: number; commandes: number; devis: number; devisAcceptes: number; prixMensuel: number | null; actif: boolean; lastSale: string | null }
  const rows = new Map<string, Row>()
  const ensure = (nom: string): Row => {
    const key = nom || '—'
    if (!rows.has(key)) rows.set(key, { nom: key, ca: 0, commandes: 0, devis: 0, devisAcceptes: 0, prixMensuel: null, actif: true, lastSale: null })
    return rows.get(key)!
  }
  for (const s of services) {
    const r = ensure(s.nom)
    r.prixMensuel = s.prix_mensuel
    r.actif = s.actif
  }
  for (const c of paid) {
    const r = ensure(c.service || '—')
    r.ca += Number(c.montant || 0)
    r.commandes += 1
    if (!r.lastSale || c.created_at > r.lastSale) r.lastSale = c.created_at
  }
  for (const d of devis) {
    const r = ensure(d.service || '—')
    r.devis += 1
    if (d.statut === 'accepte') r.devisAcceptes += 1
  }
  const serviceRows = [...rows.values()].sort((a, b) => b.ca - a.ca)

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: '#F4521E' }}>
          vivesmedia.com
        </p>
        <h1 className="text-2xl font-bold text-foreground">Services &amp; KPI</h1>
        <p className="text-muted-foreground text-sm mt-1">Performance des services vendus sur le site (Stripe / devis).</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(({ label, value, icon: Icon, accent }) => (
          <div key={label} className="rounded-2xl border border-border p-5 bg-card"
            style={accent ? { borderColor: 'rgba(244,82,30,0.2)', backgroundColor: 'rgba(244,82,30,0.04)' } : {}}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="w-4 h-4" style={{ color: accent ? '#F4521E' : undefined }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: accent ? '#F4521E' : undefined }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Par service</h2>
          <span className="text-xs text-muted-foreground">Panier moyen : {euro(panierMoyen)}</span>
        </div>
        {serviceRows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10 text-center">
            Aucune donnée de vente pour l&apos;instant (commandes / devis vides).
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border">
                  <th className="px-6 py-3 font-medium">Service</th>
                  <th className="px-3 py-3 font-medium text-right">CA</th>
                  <th className="px-3 py-3 font-medium text-right">Commandes</th>
                  <th className="px-3 py-3 font-medium text-right">Devis</th>
                  <th className="px-3 py-3 font-medium text-right">Acceptés</th>
                  <th className="px-6 py-3 font-medium text-right">Dernière vente</th>
                </tr>
              </thead>
              <tbody>
                {serviceRows.map((r) => (
                  <tr key={r.nom} className="border-b border-border last:border-0 hover:bg-secondary/40">
                    <td className="px-6 py-3">
                      <span className="font-medium text-foreground">{r.nom}</span>
                      {r.prixMensuel ? <span className="ml-2 text-[11px] text-muted-foreground">abonnement</span> : null}
                      {!r.actif ? <span className="ml-2 text-[11px] text-muted-foreground">(inactif)</span> : null}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold" style={{ color: r.ca > 0 ? '#F4521E' : undefined }}>{euro(r.ca)}</td>
                    <td className="px-3 py-3 text-right text-muted-foreground">{r.commandes}</td>
                    <td className="px-3 py-3 text-right text-muted-foreground">{r.devis}</td>
                    <td className="px-3 py-3 text-right text-muted-foreground">{r.devisAcceptes}</td>
                    <td className="px-6 py-3 text-right text-muted-foreground">
                      {r.lastSale ? new Date(r.lastSale).toLocaleDateString('fr-FR') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
