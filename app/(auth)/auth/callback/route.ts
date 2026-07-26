import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Sécurité : n'accepter qu'un chemin interne AU HUB (évite l'open redirect) et
  // renvoyer vers le Hub par défaut, pas vers la racine de la vitrine.
  const rawNext = searchParams.get('next')
  const next = rawNext && rawNext.startsWith('/hub') && !rawNext.startsWith('//') ? rawNext : '/hub/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/hub/login?error=auth`)
}
