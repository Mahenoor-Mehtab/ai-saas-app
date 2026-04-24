'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { AskAiModal } from './ask-ai-modal'

export const AskAiButton = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#0f0f0f] border border-white/15 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-xl hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all duration-300"
      >
        <Sparkles className="w-4 h-4 text-emerald-400" />
        Ask AI
      </button>

      {open && <AskAiModal onClose={() => setOpen(false)} />}
    </>
  )
}