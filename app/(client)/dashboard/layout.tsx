import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowUpRight, GraduationCap } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top nav */}
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="https://vivesmedia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5"
          >
            <span className="text-sm font-bold tracking-[0.15em] text-foreground uppercase">
              vivesmedia<span style={{ color: '#F4521E' }}>.com</span>
            </span>
          </Link>

          <div className="flex items-center gap-5">
            <Link
              href="/dashboard/formations"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5" /> Mes formations
            </Link>
            <Link
              href="https://vivesmedia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Notre site <ArrowUpRight className="w-3 h-3" />
            </Link>
            <p className="text-xs text-muted-foreground hidden md:block">{user.email}</p>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">
        {children}
      </main>

      {/* Footer conversion */}
      <footer className="bg-foreground mt-16">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: '#F4521E' }}>
                vivesmedia.com
              </p>
              <p className="text-lg font-bold text-white mb-1">
                Votre prochain projet ?
              </p>
              <p className="text-sm text-white/60 mb-5 leading-relaxed">
                Agence web & e-commerce à Avignon. Sites Shopify, SEO, référencement IA,
                publicité digitale. Devis gratuit sous 24h.
              </p>
              <div className="flex gap-3">
                <Link
                  href="https://vivesmedia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-foreground text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#F4521E' }}
                >
                  Voir nos offres <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="mailto:berangervives@gmail.com"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white border border-white/20 px-6 py-2.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">Nos services</p>
              <ul className="space-y-2">
                {[
                  'Création de site Shopify',
                  'Refonte boutique en ligne',
                  'SEO & référencement IA',
                  'Maintenance & support',
                  'Formation e-commerce',
                ].map((service) => (
                  <li key={service}>
                    <Link
                      href="https://vivesmedia.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: '#F4521E' }} />
                      {service}
                    </Link>
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
