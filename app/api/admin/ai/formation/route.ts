import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { anthropic, buildFormationSystemPrompt } from '@/lib/ai'
import type { ProjectPhase } from '@/types/database'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  // Garde : pas de clé IA → réponse propre, jamais un 500 qui fuit la stack.
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Génération IA momentanément indisponible.' }, { status: 503 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  if (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Accès réservé à l'admin" }, { status: 403 })
  }

  const {
    subject,
    phase,
    projectType,
    clientSector,
    level = 'debutant',
  } = await req.json() as {
    subject: string
    phase: ProjectPhase
    projectType: string
    clientSector?: string
    level?: 'debutant' | 'intermediaire'
  }

  if (!subject || !phase || !projectType) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 2000,
      system: buildFormationSystemPrompt(subject, phase, projectType, clientSector, level),
      messages: [
        {
          role: 'user',
          content: `Crée le module de formation complet sur : "${subject}". Respecte strictement la structure demandée.`,
        },
      ],
    })
    const content = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ content })
  } catch (e) {
    console.error('[ai/formation] erreur Anthropic:', e)
    return NextResponse.json({ error: 'La génération a échoué, réessaie dans un instant.' }, { status: 502 })
  }
}
