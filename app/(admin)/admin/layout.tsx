import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LayoutDashboard, Users, FolderOpen, Settings, LogOut } from 'lucide-react'

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/projects', label: 'Projets', icon: FolderOpen },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const isAdmin =
    user.user_metadata?.role === 'admin' ||
    user.email === process.env.ADMIN_EMAIL
  if (!isAdmin) redirect('/dashboard')

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-60 bg-zinc-900 flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-zinc-800">
          <p className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-1">
            vivesmedia.com
          </p>
          <p className="text-sm font-medium text-white">Hub Admin</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-sm font-medium"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-zinc-800">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
