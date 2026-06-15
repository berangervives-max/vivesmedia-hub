import { createAdminClient } from '@/lib/supabase/admin'
import { ExternalLink, FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

const SITE = 'https://vivesmedia.com'

type SiteArticleRow = {
  id: string
  slug: string
  titre: string
  categorie: string | null
  extrait: string | null
  publie: boolean
  date_pub: string | null
}

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function BlogAdminPage() {
  // service_role : voir TOUS les articles, y compris les brouillons programmés
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('site_articles')
    .select('id, slug, titre, categorie, extrait, publie, date_pub')
    .order('date_pub', { ascending: false, nullsFirst: false })
  const articles = (data ?? []) as unknown as SiteArticleRow[]

  const now = Date.now()
  const published = articles.filter((a) => a.publie)
  const scheduled = articles.filter((a) => !a.publie)

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: '#F4521E' }}>
            Contenu
          </p>
          <h1 className="text-2xl font-bold text-foreground">Blog</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {published.length} publié{published.length > 1 ? 's' : ''} · {scheduled.length} programmé{scheduled.length > 1 ? 's' : ''}
          </p>
        </div>
        <a
          href={`${SITE}/blog`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-all"
          style={{ backgroundColor: '#F4521E' }}
        >
          <ExternalLink className="w-4 h-4" />
          Voir le blog
        </a>
      </div>

      {!articles.length ? (
        <div className="text-center py-16 bg-card rounded-2xl border border-border">
          <FileText className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">Aucun article. Lance le seed pour importer le contenu.</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Article</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Catégorie</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Statut</th>
                <th className="text-left text-xs text-muted-foreground font-medium px-5 py-3">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => {
                const future = a.date_pub ? new Date(a.date_pub).getTime() > now : false
                return (
                  <tr key={a.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-foreground line-clamp-1">{a.titre}</span>
                      <span className="text-xs text-muted-foreground">/{a.slug}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-muted-foreground">{a.categorie ?? '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      {a.publie ? (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">Publié</span>
                      ) : (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                          {future ? 'Programmé' : 'Brouillon'}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-muted-foreground">{formatDate(a.date_pub)}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {a.publie && (
                        <a
                          href={`${SITE}/blog/${a.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Voir →
                        </a>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-6">
        Source unique <code>site_articles</code> (Supabase) — partagée avec le front public. Les brouillons programmés
        deviennent visibles automatiquement quand <code>publie</code> passe à true.
      </p>
    </div>
  )
}
