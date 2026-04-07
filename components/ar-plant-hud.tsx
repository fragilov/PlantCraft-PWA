'use client'

import { Plant, useGameStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface ARPlantHUDProps {
  plant: Plant
  onClose: () => void
}

export function ARPlantHUD({ plant, onClose }: ARPlantHUDProps) {
  const { getPlantHp } = useGameStore()
  const hp = getPlantHp(plant.id)

  // HP bar color based on health level
  const hpColor = hp >= 70 ? '#4CAF50' : hp >= 40 ? '#FFC107' : '#F44336'

  return (
    <div
      className="fixed left-0 right-0 top-0 z-[9999]"
      style={{
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(4px)',
        padding: '12px 16px',
      }}
    >
      {/* Row 1: Close button + Plant name + HP number */}
      <div className="flex items-center gap-3 mb-2">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-sm text-white hover:bg-white/20"
          aria-label="Close AR view"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </button>

        {/* Plant Name */}
        <span
          className="flex-1 text-center font-pixel text-xs text-white"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
        >
          🌿 {plant.name}
        </span>

        {/* HP Number */}
        <span
          className={cn(
            'font-pixel text-xs font-bold',
            hp < 20 && 'animate-pulse'
          )}
          style={{ color: hpColor }}
        >
          ♥ {hp}
        </span>
      </div>

      {/* Row 2: HP Bar */}
      <div
        className="h-2 w-full overflow-hidden rounded-sm"
        style={{ background: 'rgba(255,255,255,0.2)' }}
      >
        <div
          className="h-full rounded-sm"
          style={{
            width: `${hp}%`,
            background: hpColor,
            backgroundImage: `linear-gradient(90deg, ${hpColor}99, ${hpColor})`,
            transition: 'width 0.6s ease, background-color 0.4s ease',
          }}
        />
      </div>
    </div>
  )
}
