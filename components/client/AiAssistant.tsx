'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, Loader2, X, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_QUESTIONS = [
  'Que se passe-t-il pendant la phase en cours ?',
  'Quelle est la prochaine étape du projet ?',
  'Comment valider les maquettes efficacement ?',
  'Comment utiliser Shopify Admin ?',
]

export default function AiAssistant({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content:
            "Bonjour ! Je suis votre assistant IA vivesmedia.com. Je peux répondre à toutes vos questions sur votre projet, les phases à venir, ou l'utilisation de votre site. Comment puis-je vous aider ?",
        },
      ])
    }
  }, [open, messages.length])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(question: string) {
    if (!question.trim() || loading) return

    const userMsg: Message = { role: 'user', content: question }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/hub/api/client/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          projectId,
          history: messages.slice(-6),
        }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.answer ?? 'Désolé, une erreur est survenue.' },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Je suis momentanément indisponible. Créez un ticket de support si votre question est urgente." },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 text-sm font-semibold text-white px-5 py-2.5 rounded-full hover:opacity-90 transition-all"
        style={{ backgroundColor: '#F4521E' }}
      >
        <Sparkles className="w-4 h-4" />
        Assistant IA
      </button>
    )
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col" style={{ height: '480px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'rgba(244,82,30,0.1)' }}
          >
            <Bot className="w-4 h-4" style={{ color: '#F4521E' }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Assistant vivesmedia.com</p>
            <p className="text-xs text-muted-foreground">Répond à toutes vos questions projet</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'text-white rounded-br-sm'
                  : 'bg-secondary text-foreground rounded-bl-sm'
              }`}
              style={msg.role === 'user' ? { backgroundColor: '#F4521E' } : {}}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Réflexion en cours…</span>
            </div>
          </div>
        )}

        {/* Suggestions (only when fresh conversation) */}
        {messages.length === 1 && !loading && (
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground px-1">Questions fréquentes :</p>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="block w-full text-left text-xs px-3 py-2 rounded-xl bg-secondary hover:bg-border text-foreground transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-border shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question…"
            disabled={loading}
            className="flex-1 text-sm bg-secondary rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 disabled:opacity-50 transition-shadow"
            style={{ '--tw-ring-color': '#F4521E' } as React.CSSProperties}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-all disabled:opacity-40 shrink-0"
            style={{ backgroundColor: '#F4521E' }}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">
          Pour les problèmes urgents, créez un ticket de support
        </p>
      </div>
    </div>
  )
}
