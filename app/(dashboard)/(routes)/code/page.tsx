'use client'

import { Code2, Loader } from "lucide-react"
import { useState } from "react"

type Message = {
  role: 'user' | 'assistant'
  content: string
}

declare global {
  interface Window {
    puter: any
  }
}

export default function CodePage() {

  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    try {
      setLoading(true)

      const userMessage: Message = {
        role: 'user',
        content: prompt
      }

      setMessages(prev => [...prev, userMessage])

      // ✅ AI call
     const response = await window.puter.ai.chat(`
You are a senior developer.

Generate clean, production-ready code.

Rules:
- Only return code
- No explanation
- Add comments where necessary
- Use best practices

Task: ${prompt}
`)

      const assistantMessage: Message = {
        role: 'assistant',
        content: response?.message?.content?.[0]?.text || String(response)
      }

      setMessages(prev => [...prev, assistantMessage])

      setPrompt('')

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 bg-white min-h-screen p-6">

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
          <Code2 className="w-5 h-5 text-green-600" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Code Generation
          </h1>

          <p className="text-sm text-gray-500">
            Generate, debug, and explain code from a prompt.
          </p>
        </div>
      </div>

      {/* INPUT BOX */}
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Create a React login form"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
          disabled={loading}
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* LOADER */}
      {loading && (
        <div className="flex justify-center p-6">
          <Loader className="animate-spin text-gray-600" />
        </div>
      )}

      {/* EMPTY STATE */}
      {messages.length === 0 && !loading && (
        <div className="text-gray-500 text-sm">
          No code generated yet.
        </div>
      )}

      {/* OUTPUT */}
      <div className="space-y-4">
        {messages.map((message, index) => (

          message.role === 'user' ? (
            <div key={index} className="bg-blue-100 text-right p-3 rounded-lg text-sm">
              {message.content}
            </div>
          ) : (
            <div key={index} className="bg-black text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <pre>{message.content}</pre>
            </div>
          )

        ))}
      </div>

    </div>
  )
}