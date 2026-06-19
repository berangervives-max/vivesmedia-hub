import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  // Fallback placeholder : évite que le build (prerender des pages statiques)
  // plante quand l'env n'est pas dans le scope (ex. Preview Vercel). Au runtime
  // les vraies valeurs publiques sont présentes.
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'
  )
}
