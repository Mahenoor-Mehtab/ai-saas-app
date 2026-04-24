'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Sparkles } from 'lucide-react'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const EXAMPLE_QUESTIONS = [
  "What AI tools are available here?",
  "How does image generation work?",
  "What's included in the Pro plan?",
  "How many free requests do I get?",
]

const FOLLOW_UP_SUGGESTIONS = [
  "What AI tools are available here?",
  "How does image generation work?",
  "What's included in the Pro plan?",
  "How many free requests do I get?",
  "Can I generate code using AI?",
  "How does music generation work?",
  "How does video generation work?",
]

interface AskAiModalProps {
  onClose: () => void
}

export const AskAiModal = ({ onClose }: AskAiModalProps) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMessage: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post('/api/ask-ai', { messages: newMessages })
      const reply: Message = res.data
      setMessages([...newMessages, reply])
    } catch {
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again!'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-2xl flex flex-col"
        style={{ height: '520px' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-semibold text-sm">Ask AI</span>
          </div>
          <button onClick={onClose}
            className="text-white/40 hover:text-white transition rounded-full p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="space-y-4">
              <p className="text-white/50 text-sm">
                I can help you with anything about{' '}
                <span className="bg-purple-600/40 text-purple-300 px-2 py-0.5 rounded text-xs font-mono">
                  Genius
                </span>
              </p>
              <p className="text-white/30 text-xs uppercase tracking-widest">
                Example Questions
              </p>
              <div className="space-y-2">
                {EXAMPLE_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="w-full text-left text-sm text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === 'user'
                  ? 'bg-emerald-500/20 text-emerald-100 rounded-br-sm'
                  : 'bg-white/8 text-white/80 rounded-bl-sm border border-white/10'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Follow-up suggestions — answer aane ke baad dikhenge */}
          {messages.length > 0 && !loading && (
            <div className="space-y-2 mt-2">
              <p className="text-white/30 text-xs uppercase tracking-widest">Suggested</p>
              {FOLLOW_UP_SUGGESTIONS
                .filter(q => !messages.find(m => m.content === q))
                .slice(0, 3)
                .map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="w-full text-left text-xs text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 transition"
                  >
                    {q}
                  </button>
                ))}
            </div>
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/8 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-white/10">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="How do I get started?"
              className="flex-1 bg-transparent text-white text-sm placeholder:text-white/25 outline-none"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="text-emerald-400 hover:text-emerald-300 disabled:opacity-30 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}