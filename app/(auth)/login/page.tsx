'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ArrowUpRight, Mail, Lock } from 'lucide-react'

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

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    })

    if (error) {
      toast.error('Aucun compte trouvé pour cet email.')
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
      window.location.href = '/hub/admin'
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      {/* Subtle gradient background like vivesmedia.com hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #F4521E 0%, transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: '#F4521E' }}>
            vivesmedia.com
          </p>
          <h1 className="text-3xl font-bold text-foreground leading-tight">
            {step === 'sent'
              ? 'Email envoyé !'
              : <>Accéder à <span className="font-heading italic font-normal">mon espace</span></>
            }
          </h1>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          {step === 'sent' ? (
            <div className="text-center space-y-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: 'rgba(244,82,30,0.1)' }}>
                <Mail className="w-6 h-6" style={{ color: '#F4521E' }} />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Un lien de connexion a été envoyé à<br />
                <strong className="text-foreground">{email}</strong>.<br />
                Vérifiez votre boîte mail (et vos spams).
              </p>
              <button
                onClick={() => { setStep('email'); setEmail('') }}
                className="text-xs text-muted-foreground underline underline-offset-4 mt-2"
              >
                Utiliser un autre email
              </button>
            </div>
          ) : step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
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
                  className="h-11 rounded-xl border-border"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 text-white font-semibold h-11 rounded-full transition-all hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: '#F4521E', boxShadow: '0 4px 20px rgba(244,82,30,0.3)' }}
              >
                {loading ? 'Vérification…' : <>Continuer <ArrowUpRight className="w-4 h-4" /></>}
              </button>
              <p className="text-center text-xs text-muted-foreground pt-1">
                Lien de connexion sécurisé envoyé par email
              </p>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email-display" className="text-sm font-medium text-foreground">Email</Label>
                <Input
                  id="email-display"
                  type="email"
                  value={email}
                  disabled
                  className="h-11 rounded-xl bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoFocus
                  className="h-11 rounded-xl border-border"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 text-white font-semibold h-11 rounded-full transition-all hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: '#F4521E', boxShadow: '0 4px 20px rgba(244,82,30,0.3)' }}
              >
                {loading ? 'Connexion…' : <>Se connecter <ArrowUpRight className="w-4 h-4" /></>}
              </button>
              <button
                type="button"
                onClick={() => { setStep('email'); setPassword('') }}
                className="w-full text-xs text-muted-foreground underline underline-offset-4"
              >
                ← Retour
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2026 vivesmedia.com · Avignon, France
        </p>
      </div>
    </div>
  )
}
