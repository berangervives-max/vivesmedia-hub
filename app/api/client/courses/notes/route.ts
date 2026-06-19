import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: client } = await supabase
    .from('clients').select('id').eq('user_id', user.id).maybeSingle()
  if (!client) return NextResponse.json({ error: 'No client' }, { status: 403 })

  const { courseSlug, lessonId, content } = await req.json()
  if (!courseSlug || !lessonId) return NextResponse.json({ error: 'Bad request' }, { status: 400 })

  const { error } = await supabase
    .from('course_notes')
    .upsert(
      {
        client_id: client.id,
        course_slug: courseSlug,
        lesson_id: lessonId,
        content: typeof content === 'string' ? content : '',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'client_id,lesson_id' }
    )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
