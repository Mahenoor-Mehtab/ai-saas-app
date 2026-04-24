'use client'

import { Montserrat } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { cn } from '@/lib/utils'
import { Code, ImageIcon, LayoutDashboard, MessageSquare, Music, Settings2, VideoIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] })

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-400",
    glow: "group-hover:text-sky-300",
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-violet-400",
    glow: "group-hover:text-violet-300",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    href: "/image",
    color: "text-pink-400",
    glow: "group-hover:text-pink-300",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    href: "/video",
    color: "text-orange-400",
    glow: "group-hover:text-orange-300",
  },
  {
    label: "Music Generation",
    icon: Music,
    href: "/music",
    color: "text-emerald-400",
    glow: "group-hover:text-emerald-300",
  },
  {
    label: "Code Generation",
    icon: Code,
    href: "/code",
    color: "text-green-400",
    glow: "group-hover:text-green-300",
  },
  // {
  //   label: "Settings",
  //   icon: Settings2,
  //   href: "/settings",
  //   color: "text-white/40",
  //   glow: "group-hover:text-white/70",
  // },
]

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <div className='flex flex-col h-full text-white'
      style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0d18 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Logo */}
      <div className='px-5 pt-6 pb-8'>
        <Link href="/dashboard" className='flex items-center gap-3 group'>
          <div className='relative w-9 h-9 rounded-xl overflow-hidden'
            style={{ boxShadow: '0 0 20px rgba(52, 211, 153, 0.3)' }}>
            <Image alt="Logo" src="/logo.png" width={40} height={40} className='object-cover' />
          </div>
          <h1 className={cn("text-xl font-bold tracking-wide text-white group-hover:text-emerald-400 transition-colors duration-300", montserrat.className)}>
            Genius
          </h1>
        </Link>
      </div>

      {/* Divider */}
      <div className='mx-4 mb-4 h-px' style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />

      {/* Nav label */}
      <p className='px-5 mb-3 text-[10px] font-semibold tracking-widest uppercase text-white/25'>
        Navigation
      </p>

      {/* Routes */}
      <div className='flex-1 px-3 space-y-1'>
        {routes.map((route) => {
          const isActive = pathname === route.href
          return (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative',
                isActive
                  ? 'bg-white/8 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              {/* Active left border indicator */}
              {isActive && (
                <span className='absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full'
                  style={{ background: 'linear-gradient(180deg, #34d399, #6ee7b7)' }} />
              )}

              <route.icon className={cn(
                'h-4 w-4 shrink-0 transition-colors duration-200',
                isActive ? route.color : cn(route.color, 'opacity-60', route.glow)
              )} />

              <span className='flex-1'>{route.label}</span>

              {/* Active dot */}
              {isActive && (
                <span className='w-1.5 h-1.5 rounded-full bg-emerald-400'
                  style={{ boxShadow: '0 0 6px rgba(52, 211, 153, 0.8)' }} />
              )}
            </Link>
          )
        })}
      </div>

      {/* Bottom section */}
      <div className='p-4 mx-3 mb-4 rounded-xl'
        style={{ background: 'rgba(52, 211, 153, 0.05)', border: '1px solid rgba(52, 211, 153, 0.1)' }}>
        <p className='text-xs text-white/40 mb-1'>Current Plan</p>
        <p className='text-sm font-semibold text-emerald-400'>Free Tier</p>
        <p className='text-xs text-white/30 mt-0.5'>Upgrade to Pro →</p>
      </div>
    </div>
  )
}

export default Sidebar