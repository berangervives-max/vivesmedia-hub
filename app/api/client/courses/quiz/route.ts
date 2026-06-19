import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: client } = await supabase
    .from('clients').select('id').eq('user_id', user.id).maybeSingle()
  if (!client) return NextResponse.json({ error: 'No client' }, { status: 403 })

  const { courseSlug, quizId, score, total, answers } = await req.json()
  if (!courseSlug || !quizId || typeof score !== 'number' || typeof total !== 'number') {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const { error } = await supabase.from('quiz_attempts').insert({
    client_id: client.id,
    course_slug: courseSlug,
    quiz_id: quizId,
    score,
    total,
    answers: Array.isArray(answers) ? answers : [],
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
