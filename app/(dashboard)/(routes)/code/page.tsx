'use client'

import { Code2, Loader, Copy, Check, Trash2 } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import ReactMarkdown from "react-markdown"

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function CodePage() {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    try {
      setLoading(true)

      const userMessage: Message = { role: 'user', content: prompt }
      const newMessages = [...messages, userMessage]

      // ✅ Groq API route call
      const response = await axios.post('/api/code', {
        messages: newMessages
      })

      setMessages([...newMessages, response.data])
      setPrompt('')

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleClear = () => setMessages([])

  return (
    <div className="space-y-6 bg-white min-h-screen p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
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

        {/* ✅ Clear Chat Button */}
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* INPUT BOX */}
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && handleGenerate()}
          placeholder="e.g. Create a React login form..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 text-sm"
          disabled={loading}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-green-700 transition"
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
        <div className="text-gray-400 text-sm text-center py-10">
          No code generated yet. Type a prompt above ☝️
        </div>
      )}

      {/* OUTPUT */}
      <div className="space-y-4">
        {messages.map((message, index) => (
          message.role === 'user' ? (
            // ✅ User message
            <div key={index} className="bg-blue-50 border border-blue-100 text-right p-3 rounded-lg text-sm text-blue-800">
              {message.content}
            </div>
          ) : (
            // ✅ Assistant message with markdown + copy button
            <div key={index} className="relative group bg-[#0d1117] rounded-xl overflow-hidden border border-gray-700">

              {/* Copy Button */}
              <button
                onClick={() => handleCopy(message.content, index)}
                className="absolute top-3 right-3 z-10 bg-gray-700 hover:bg-gray-600 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition"
              >
                {copiedIndex === index
                  ? <Check className="w-3.5 h-3.5 text-green-400" />
                  : <Copy className="w-3.5 h-3.5" />
                }
              </button>

              {/* Markdown Code Render */}
              <div className="p-4 text-sm font-mono text-green-400 overflow-x-auto">
                <ReactMarkdown
                  components={{
                    pre: ({ children }) => (
                      <pre className="whitespace-pre-wrap break-words">{children}</pre>
                    ),
                    code: ({ children }) => (
                      <code className="text-green-300">{children}</code>
                    )
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          )
        ))}
      </div>

    </div>
  )
}