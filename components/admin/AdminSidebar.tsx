'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FolderOpen, Settings, LogOut, ArrowUpRight, Newspaper, BarChart3, GraduationCap } from 'lucide-react'

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/clients', label: 'Clients', icon: Users, exact: false },
  { href: '/admin/projects', label: 'Projets', icon: FolderOpen, exact: false },
  { href: '/admin/services', label: 'Services & KPI', icon: BarChart3, exact: false },
  { href: '/admin/formations', label: 'Formations', icon: GraduationCap, exact: false },
  { href: '/admin/blog', label: 'Blog', icon: Newspaper, exact: false },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings, exact: false },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-60 bg-foreground flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/10">
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-0.5" style={{ color: '#F4521E' }}>
          vivesmedia.com
        </p>
        <p className="text-sm font-semibold text-white">Hub Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navLinks.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'text-foreground'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
              style={active ? { backgroundColor: '#F4521E' } : {}}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Lien vers vivesmedia.com */}
      <div className="px-3 py-3 border-t border-white/10 border-b">
        <Link
          href="https://vivesmedia.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          vivesmedia.com
        </Link>
      </div>

      {/* User + signout */}
      <div className="px-3 py-4">
        <div className="px-3 py-1 mb-1">
          <p className="text-xs text-white/30 truncate">{userEmail}</p>
        </div>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Se déconnecter
          </button>
        </form>
      </div>
    </aside>
  )
}
