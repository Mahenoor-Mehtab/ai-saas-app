'use client'
import { ArrowRight, Code, ImageIcon, MessageSquare, Music, VideoIcon } from 'lucide-react'
import React from 'react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const tools = [
  {
    label: "Conversation",
    icon: MessageSquare,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "hover:border-violet-500/30",
    glow: "hover:shadow-violet-500/10",
    href: '/conversation',
    description: "Chat with the smartest AI model"
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    href: "/image",
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    borderColor: "hover:border-pink-500/30",
    glow: "hover:shadow-pink-500/10",
    description: "Turn your ideas into stunning visuals"
  },
  {
    label: "Code Generation",
    icon: Code,
    href: "/code",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "hover:border-emerald-500/30",
    glow: "hover:shadow-emerald-500/10",
    description: "Generate clean code in any language"
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    href: "/video",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "hover:border-orange-500/30",
    glow: "hover:shadow-orange-500/10",
    description: "Create stunning AI-powered videos"
  },
  {
    label: "Music Generation",
    icon: Music,
    href: "/music",
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
    borderColor: "hover:border-sky-500/30",
    glow: "hover:shadow-sky-500/10",
    description: "Generate original music with AI"
  },
]

const DashboardPage = () => {
  const router = useRouter()

  return (
    <div className='min-h-screen px-4 md:px-20 lg:px-32 py-12'>

      {/* Header */}
      <div className='mb-12 space-y-4 text-center'>
        <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4'
          style={{ background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.2)', color: '#34d399' }}>
          <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
          AI Tools Ready
        </div>
        <h2 className='text-3xl md:text-5xl font-bold text-white tracking-tight'>
          Explore the power of{' '}
          <span style={{ background: 'linear-gradient(135deg, #34d399, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI
          </span>
        </h2>
        <p className='text-white/40 text-sm md:text-base max-w-md mx-auto'>
          Chat with the smartest AI — Experience the future of creativity
        </p>
      </div>

      {/* Tools Grid */}
      <div className='space-y-3 max-w-3xl mx-auto'>
        {tools.map((tool) => (
          <div
            onClick={() => router.push(tool.href)}
            key={tool.href}
            className={cn(
              'group flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all duration-300',
              'border hover:shadow-lg',
              tool.borderColor,
              tool.glow
            )}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.transform = 'translateX(4px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              e.currentTarget.style.transform = 'translateX(0)'
            }}
          >
            <div className='flex items-center gap-4'>
              {/* Icon */}
              <div className={cn('p-3 rounded-xl transition-transform duration-300 group-hover:scale-110', tool.bgColor)}>
                <tool.icon className={cn('w-6 h-6', tool.color)} />
              </div>

              {/* Text */}
              <div>
                <p className='font-semibold text-white text-sm'>{tool.label}</p>
                <p className='text-white/35 text-xs mt-0.5'>{tool.description}</p>
              </div>
            </div>

            {/* Arrow */}
            <ArrowRight className='w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300' />
          </div>
        ))}
      </div>

      {/* Bottom Stats */}
      <div className='mt-12 flex items-center justify-center gap-8'>
        {[
          { label: 'AI Models', value: '5+' },
          { label: 'Generations', value: '∞' },
          { label: 'Response Time', value: '<1s' },
        ].map((stat) => (
          <div key={stat.label} className='text-center'>
            <p className='text-2xl font-bold text-white'>{stat.value}</p>
            <p className='text-xs text-white/30 mt-0.5'>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage