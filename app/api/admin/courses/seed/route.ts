import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { COURSES } from '@/lib/courses'

// Importe les cours définis dans le code (lib/courses) vers la table `courses`.
// ignoreDuplicates : ne réécrit PAS un cours déjà présent (édité par l'admin).
export async function POST(_req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Accès réservé à l\'admin' }, { status: 403 })
  }

  const admin = createAdminClient()
  const rows = COURSES.map((c, i) => ({
    slug: c.slug,
    data: c,
    published: true,
    position: i,
  }))

  const { error } = await admin
    .from('courses')
    .upsert(rows, { onConflict: 'slug', ignoreDuplicates: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, imported: rows.length })
}
