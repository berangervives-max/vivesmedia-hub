import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const adminEmail = process.env.ADMIN_EMAIL
  if (!user || (user.user_metadata?.role !== 'admin' && user.email !== adminEmail)) {
    return { supabase, user: null }
  }
  return { supabase, user }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params
  const { supabase, user } = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, url } = await request.json()
  if (!title || !url) return NextResponse.json({ error: 'Missing title or url' }, { status: 400 })

  const { data: lastVideo } = await supabase
    .from('training_videos')
    .select('position')
    .eq('project_id', projectId)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle()

  const position = (lastVideo?.position ?? 0) + 1

  const { data: video, error } = await supabase
    .from('training_videos')
    .insert({ project_id: projectId, title, description: description ?? null, url, position })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ video })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params
  const { supabase, user } = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { videoId } = await request.json()
  if (!videoId) return NextResponse.json({ error: 'Missing videoId' }, { status: 400 })

  const { error } = await supabase
    .from('training_videos')
    .delete()
    .eq('id', videoId)
    .eq('project_id', projectId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
