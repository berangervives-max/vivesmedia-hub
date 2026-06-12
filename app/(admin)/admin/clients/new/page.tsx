'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    projectName: '',
  })

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/hub/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? 'Erreur serveur')

      toast.success('Client créé et invitation envoyée !')
      router.push('/admin/clients')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur inattendue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link
        href="/admin/clients"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux clients
      </Link>

      <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: '#F4521E' }}>
        Nouveau client
      </p>
      <h1 className="text-2xl font-bold text-foreground mb-2">Créer un compte client</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Un email d'invitation sera automatiquement envoyé au client.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Infos client */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <p className="text-sm font-semibold text-foreground mb-5">Informations client</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Nom complet *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Jean Dupont"
                  required
                  className="h-11 rounded-xl border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="jean@exemple.com"
                  required
                  className="h-11 rounded-xl border-border"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium text-foreground">Entreprise</Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={set('company')}
                  placeholder="ACME SAS"
                  className="h-11 rounded-xl border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-foreground">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="+33 6 00 00 00 00"
                  className="h-11 rounded-xl border-border"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Premier projet */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <p className="text-sm font-semibold text-foreground mb-5">Premier projet</p>
          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-sm font-medium text-foreground">Nom du projet *</Label>
            <Input
              id="projectName"
              value={form.projectName}
              onChange={set('projectName')}
              placeholder="Site vitrine ACME"
              required
              className="h-11 rounded-xl border-border"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 text-sm font-semibold text-white px-6 py-2.5 rounded-full hover:opacity-90 transition-all disabled:opacity-60"
            style={{ backgroundColor: '#F4521E' }}
          >
            {loading ? 'Création…' : <>Créer et envoyer l'invitation <ArrowUpRight className="w-4 h-4" /></>}
          </button>
          <Link
            href="/admin/clients"
            className="flex items-center text-sm font-medium text-muted-foreground border border-border px-6 py-2.5 rounded-full hover:bg-secondary transition-colors"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
