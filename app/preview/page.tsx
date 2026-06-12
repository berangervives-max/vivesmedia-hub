import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  FileText, Image, Receipt, Play, ArrowLeft, ChevronRight,
  ArrowUpRight, MessageCircle, AlertCircle,
} from 'lucide-react'

const MOCK_PROJECT = { name: 'Boutique La Maison Dorée', phase: 'design' as const }

const MOCK_PHASES = [
  { key: 'onboarding', label: 'Onboarding' },
  { key: 'design', label: 'Design' },
  { key: 'dev', label: 'Développement' },
  { key: 'recette', label: 'Recette' },
  { key: 'livraison', label: 'Livraison' },
  { key: 'maintenance', label: 'Maintenance' },
]

const MOCK_FILES = [
  { id: '1', name: 'Brief_client_signé.pdf', category: 'file', date: '05/06/2026' },
  { id: '2', name: 'Maquette_accueil_v2.figma', category: 'maquette', date: '08/06/2026' },
  { id: '3', name: 'Facture_acompte_50pct.pdf', category: 'invoice', date: '01/06/2026' },
]

const MOCK_VIDEOS = [
  { id: '1', title: 'Comment ajouter un produit Shopify', description: 'Tutoriel complet — 8 min' },
  { id: '2', title: 'Gérer vos commandes et expéditions', description: 'Traitement des commandes — 12 min' },
  { id: '3', title: 'Paramétrer les réductions et codes promo', description: 'Marketing Shopify — 6 min' },
]

const MOCK_TICKETS = [
  { id: '1', title: 'La page Contact ne charge pas sur mobile', status: 'in_progress', date: '10/06/2026' },
  { id: '2', title: 'Modifier le texte de la bannière promo', status: 'resolved', date: '03/06/2026' },
]

const FILE_ICONS = { file: FileText, maquette: Image, invoice: Receipt }
const FILE_LABELS = { file: 'Document', maquette: 'Maquette', invoice: 'Facture' }

const currentPhaseIndex = MOCK_PHASES.findIndex((p) => p.key === MOCK_PROJECT.phase)
const progress = Math.round(((currentPhaseIndex + 1) / MOCK_PHASES.length) * 100)

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Preview banner */}
      <div className="text-white text-xs text-center py-2 px-4 font-medium" style={{ backgroundColor: '#F4521E' }}>
        Mode prévisualisation — vue client fictive &nbsp;·&nbsp;
        <Link href="/" className="underline hover:no-underline">Quitter la prévisualisation</Link>
      </div>

      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="https://vivesmedia.com" target="_blank" rel="noopener noreferrer">
            <span className="text-sm font-bold tracking-[0.15em] text-foreground uppercase">
              vivesmedia<span style={{ color: '#F4521E' }}>.com</span>
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <Link href="https://vivesmedia.com" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              Notre site <ArrowUpRight className="w-3 h-3" />
            </Link>
            <span className="text-xs text-muted-foreground hidden md:block">marie@lamaisondoree.fr</span>
            <span className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Déconnexion
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">
        <Link href="#" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Mes projets
        </Link>

        {/* Project header card */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-foreground">{MOCK_PROJECT.name}</h1>
              <span className="inline-flex items-center mt-2 text-xs font-semibold px-3 py-1 rounded-full border bg-purple-50 text-purple-700 border-purple-200">
                Design
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-5">Création des maquettes et de l'identité visuelle</p>

          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Avancement global</span>
            <span className="font-semibold text-foreground">{progress}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden mb-5">
            <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: '#F4521E' }} />
          </div>

          <div className="flex items-center gap-0.5 flex-wrap">
            {MOCK_PHASES.map((p, index) => (
              <div key={p.key} className="flex items-center gap-0.5">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  index < currentPhaseIndex ? 'text-muted-foreground' :
                  index === currentPhaseIndex ? 'text-white font-semibold' :
                  'text-muted-foreground/50'
                }`} style={index === currentPhaseIndex ? { backgroundColor: '#F4521E' } : {}}>
                  {index < currentPhaseIndex && <span className="text-[10px]">✓</span>}
                  {p.label}
                </div>
                {index < MOCK_PHASES.length - 1 && <ChevronRight className="w-3 h-3 text-border shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Action requise banner */}
        <div className="rounded-2xl border p-5 mb-6" style={{ backgroundColor: 'rgba(244,82,30,0.04)', borderColor: 'rgba(244,82,30,0.2)' }}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(244,82,30,0.1)' }}>
              <AlertCircle className="w-4 h-4" style={{ color: '#F4521E' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Action requise : formulaire de démarrage</p>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                Pour démarrer votre projet, merci de compléter le formulaire d'onboarding. Cela prend 5 à 10 minutes.
              </p>
              <span className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2 rounded-full cursor-pointer hover:opacity-90 transition-all"
                style={{ backgroundColor: '#F4521E' }}>
                Remplir le formulaire <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="files">
          <TabsList className="mb-6 bg-secondary rounded-xl p-1">
            <TabsTrigger value="files" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Documents ({MOCK_FILES.length})
            </TabsTrigger>
            <TabsTrigger value="training" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Formation ({MOCK_VIDEOS.length})
            </TabsTrigger>
            <TabsTrigger value="support" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Support ({MOCK_TICKETS.length})
            </TabsTrigger>
          </TabsList>

          {/* Documents */}
          <TabsContent value="files">
            <div className="bg-card rounded-2xl border border-border p-6">
              <p className="text-xs text-muted-foreground mb-4">Cliquez sur un fichier pour le télécharger. Liens valables 1 heure.</p>
              <div className="space-y-1">
                {MOCK_FILES.map((file) => {
                  const Icon = FILE_ICONS[file.category as keyof typeof FILE_ICONS]
                  return (
                    <div key={file.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors group cursor-pointer">
                      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-border transition-colors">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {FILE_LABELS[file.category as keyof typeof FILE_LABELS]} · {file.date}
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
                    </div>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          {/* Formation */}
          <TabsContent value="training">
            <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {MOCK_VIDEOS.map((video) => (
                  <div key={video.id} className="group flex items-center gap-3 p-4 rounded-xl border border-border hover:border-foreground transition-all hover:shadow-sm bg-background cursor-pointer">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#F4521E' }}>
                      <Play className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">{video.title}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{video.description}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
                  </div>
                ))}
              </div>

              {/* Upsell */}
              <div className="rounded-2xl bg-foreground p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: '#F4521E' }}>
                  Aller plus loin
                </p>
                <h3 className="text-lg font-bold text-white mb-2">Boostez votre visibilité en ligne</h3>
                <p className="text-sm text-white/60 mb-5 leading-relaxed">
                  Ces formations couvrent les bases. Pour maximiser vos résultats — SEO, référencement sur les
                  intelligences artificielles (ChatGPT, Google AI…), publicités ciblées, emails automatisés —
                  nous proposons un accompagnement sur mesure.
                </p>
                <span className="inline-flex items-center gap-2 text-foreground text-sm font-semibold px-6 py-2.5 rounded-full cursor-pointer hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#F4521E' }}>
                  Découvrir nos formules <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </TabsContent>

          {/* Support */}
          <TabsContent value="support">
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="rounded-xl bg-secondary p-4 mb-5">
                <p className="text-sm font-semibold text-foreground mb-1">Comment fonctionne le support ?</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Décrivez votre demande avec précision. Notre équipe répond sous <strong className="text-foreground">24-48h ouvrées</strong>.
                  Pour les urgences (site hors ligne), choisissez le niveau "Urgent".
                </p>
              </div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-foreground">{MOCK_TICKETS.length} ticket(s)</p>
                <span className="inline-flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-2 rounded-full cursor-pointer hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#F4521E' }}>
                  <MessageCircle className="w-3.5 h-3.5" />
                  Nouveau ticket
                </span>
              </div>
              <div className="space-y-2">
                {MOCK_TICKETS.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary">
                    <div>
                      <p className="text-sm font-medium text-foreground">{ticket.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Ouvert le {ticket.date}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${
                      ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {ticket.status === 'in_progress' ? 'En cours' : 'Résolu'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer — dark comme vivesmedia.com */}
      <footer className="bg-foreground mt-16">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: '#F4521E' }}>
                vivesmedia.com
              </p>
              <p className="text-lg font-bold text-white mb-1">Votre prochain projet ?</p>
              <p className="text-sm text-white/60 mb-5 leading-relaxed">
                Agence web & e-commerce à Avignon. Sites Shopify, SEO, référencement IA,
                publicité digitale. Devis gratuit sous 24h.
              </p>
              <div className="flex gap-3">
                <Link href="https://vivesmedia.com" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#F4521E' }}>
                  Voir nos offres <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="mailto:berangervives@gmail.com"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white border border-white/20 px-6 py-2.5 rounded-full hover:bg-white/10 transition-colors">
                  Nous contacter
                </Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">Nos services</p>
              <ul className="space-y-2">
                {['Création de site Shopify', 'Refonte boutique en ligne', 'SEO & référencement IA', 'Maintenance & support', 'Formation e-commerce'].map((s) => (
                  <li key={s} className="text-xs text-white/50 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: '#F4521E' }} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <p className="text-xs text-white/30">© 2026 vivesmedia.com — Tous droits réservés</p>
            <p className="text-xs text-white/30">Avignon, France</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
