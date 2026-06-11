import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogOut } from 'lucide-react'

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
    <div className="min-h-screen bg-zinc-50">
      {/* Top nav */}
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold tracking-widest text-zinc-900 uppercase">
              vivesmedia.com
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-zinc-400 hidden sm:block">{user.email}</p>
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

      <main className="max-w-4xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
