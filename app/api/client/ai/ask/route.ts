import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { anthropic, buildClientSystemPrompt } from '@/lib/ai'
import type { ProjectPhase } from '@/types/database'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { question, projectId, history = [] } = await req.json() as {
    question: string
    projectId: string
    history: { role: 'user' | 'assistant'; content: string }[]
  }

  if (!question?.trim()) return NextResponse.json({ error: 'Question vide' }, { status: 400 })

  const { data: client } = await supabase
    .from('clients')
    .select('id, name')
    .eq('user_id', user.id)
    .single()

  if (!client) return NextResponse.json({ error: 'Client introuvable' }, { status: 403 })

  const { data: project } = await supabase
    .from('projects')
    .select('name, current_phase')
    .eq('id', projectId)
    .eq('client_id', client.id)
    .single()

  if (!project) return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 })

  const messages: { role: 'user' | 'assistant'; content: string }[] = [
    ...history.slice(-6),
    { role: 'user', content: question },
  ]

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system: buildClientSystemPrompt(project.current_phase as ProjectPhase, project.name),
    messages,
  })

  const answer = response.content[0].type === 'text' ? response.content[0].text : ''
  return NextResponse.json({ answer })
}
