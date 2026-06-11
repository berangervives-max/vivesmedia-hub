'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<'email' | 'password' | 'sent'>('email')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const isAdmin = email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
    if (isAdmin) {
      setStep('password')
      setLoading(false)
      return
    }

    // Client → magic link OTP
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    })

    if (error) {
      toast.error("Aucun compte trouvé pour cet email.")
    } else {
      setStep('sent')
    }
    setLoading(false)
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error('Email ou mot de passe incorrect.')
    } else {
      window.location.href = '/admin'
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold tracking-widest text-zinc-400 uppercase mb-2">
            vivesmedia.com
          </p>
          <h1 className="text-2xl font-semibold text-zinc-900">
            {step === 'sent' ? 'Email envoyé !' : 'Accéder à mon espace'}
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8">
          {step === 'sent' ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto">
                <span className="text-white text-xl">✓</span>
              </div>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Un lien de connexion a été envoyé à <strong>{email}</strong>.<br />
                Vérifiez votre boîte mail (et vos spams).
              </p>
              <button
                onClick={() => { setStep('email'); setEmail('') }}
                className="text-xs text-zinc-400 underline underline-offset-2 mt-4"
              >
                Utiliser un autre email
              </button>
            </div>
          ) : step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-700">
                  Adresse email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  required
                  autoFocus
                  className="h-11"
                />
              </div>
              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? 'Vérification…' : 'Continuer →'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email-display" className="text-zinc-700">
                  Email
                </Label>
                <Input
                  id="email-display"
                  type="email"
                  value={email}
                  disabled
                  className="h-11 bg-zinc-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-700">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoFocus
                  className="h-11"
                />
              </div>
              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? 'Connexion…' : 'Se connecter'}
              </Button>
              <button
                type="button"
                onClick={() => { setStep('email'); setPassword('') }}
                className="w-full text-xs text-zinc-400 underline underline-offset-2"
              >
                ← Retour
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
