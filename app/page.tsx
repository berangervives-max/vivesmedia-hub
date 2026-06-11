import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function RootPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const isAdmin =
    user.user_metadata?.role === 'admin' ||
    user.email === process.env.ADMIN_EMAIL

  if (isAdmin) redirect('/admin')

  redirect('/dashboard')
}
