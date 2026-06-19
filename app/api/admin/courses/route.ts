import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Course } from '@/lib/courses/types'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  if (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return { error: NextResponse.json({ error: 'Accès réservé à l\'admin' }, { status: 403 }) }
  }
  return { user }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if ('error' in auth) return auth.error

  const body = await req.json()
  const action = body.action as string
  const admin = createAdminClient()

  if (action === 'delete') {
    if (!body.slug) return NextResponse.json({ error: 'slug manquant' }, { status: 400 })
    const { error } = await admin.from('courses').delete().eq('slug', body.slug)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (action === 'publish') {
    const { error } = await admin
      .from('courses')
      .update({ published: !!body.published, updated_at: new Date().toISOString() })
      .eq('slug', body.slug)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // action === 'save'
  const course = body.course as Course
  if (!course?.slug || !course?.title) {
    return NextResponse.json({ error: 'slug et titre requis' }, { status: 400 })
  }
  const { error } = await admin
    .from('courses')
    .upsert(
      {
        slug: course.slug,
        data: course,
        published: body.published !== false,
        position: typeof body.position === 'number' ? body.position : 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'slug' }
    )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, slug: course.slug })
}
