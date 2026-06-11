import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!client) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: project } = await supabase
    .from('projects')
    .select('id, is_maintenance')
    .eq('id', projectId)
    .eq('client_id', client.id)
    .single()

  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  if (!project.is_maintenance) {
    return NextResponse.json(
      { error: 'Support tickets are only available for maintenance projects' },
      { status: 403 }
    )
  }

  const { title, description, priority } = await request.json()

  if (!title || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: ticket, error } = await supabase
    .from('tickets')
    .insert({
      project_id: projectId,
      client_id: client.id,
      title,
      description,
      priority: priority ?? 'medium',
      status: 'open',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ticket })
}
