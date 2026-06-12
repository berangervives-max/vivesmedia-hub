import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

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
      <AdminSidebar userEmail={user.email ?? ''} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
