import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: client } = await supabase
    .from('clients').select('id').eq('user_id', user.id).maybeSingle()
  if (!client) return NextResponse.json({ error: 'No client' }, { status: 403 })

  const { courseSlug, lessonId, completed } = await req.json()
  if (!courseSlug || !lessonId) return NextResponse.json({ error: 'Bad request' }, { status: 400 })

  if (completed) {
    const { error } = await supabase
      .from('lesson_progress')
      .upsert(
        { client_id: client.id, course_slug: courseSlug, lesson_id: lessonId },
        { onConflict: 'client_id,lesson_id' }
      )
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    const { error } = await supabase
      .from('lesson_progress')
      .delete()
      .eq('client_id', client.id)
      .eq('lesson_id', lessonId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
