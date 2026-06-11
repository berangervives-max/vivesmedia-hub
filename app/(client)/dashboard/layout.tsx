import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogOut, MessageCircle, ExternalLink } from 'lucide-react'

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
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="https://vivesmedia.com" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2">
            <span className="text-sm font-bold tracking-widest text-zinc-900 uppercase group-hover:text-zinc-600 transition-colors">
              vivesmedia.com
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="https://vivesmedia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Notre site
            </Link>
            <p className="text-xs text-zinc-400 hidden md:block">{user.email}</p>
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer conversion */}
      <footer className="bg-white border-t border-zinc-100 mt-8">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2">
              <p className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">vivesmedia.com</p>
              <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
                Agence web & e-commerce spécialisée Shopify, SEO et acquisition digitale.
                Basée à Avignon, nous accompagnons les entrepreneurs et PME qui veulent vendre plus en ligne.
              </p>
              <div className="flex gap-3">
                <Link
                  href="https://vivesmedia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Découvrir nos services →
                </Link>
                <Link
                  href="mailto:berangervives@gmail.com"
                  className="inline-flex items-center gap-1.5 text-xs font-medium border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Nous contacter
                </Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Nos services</p>
              <ul className="space-y-1.5">
                {[
                  'Création de site Shopify',
                  'Refonte de boutique en ligne',
                  'SEO & référencement naturel',
                  'Maintenance & support',
                  'Formation e-commerce',
                ].map((service) => (
                  <li key={service}>
                    <Link
                      href="https://vivesmedia.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-zinc-300 shrink-0" />
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-50 flex items-center justify-between">
            <p className="text-xs text-zinc-300">
              © {new Date().getFullYear()} vivesmedia.com — Tous droits réservés
            </p>
            <p className="text-xs text-zinc-300">Avignon, France</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
