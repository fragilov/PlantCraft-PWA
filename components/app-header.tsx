'use client'

import { useGameStore } from '@/lib/store'

export function AppHeader() {
  const { coins, level, xp } = useGameStore()
  const xpProgress = (xp / 100) * 100

  return (
    <header className="sticky top-0 z-40 border-b-2 border-primary bg-card px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <h1 className="font-pixel text-sm text-primary">
          PlantCraft
        </h1>

        {/* Stats */}
        <div className="flex items-center gap-4">
          {/* Coins */}
          <div className="flex items-center gap-1.5">
            <span className="text-lg">💰</span>
            <span className="font-pixel text-xs text-accent">{coins}</span>
            <span className="font-pixel text-[8px] text-muted-foreground">GC</span>
          </div>

          {/* Level */}
          <div className="flex items-center gap-1.5">
            <span className="text-lg">⭐</span>
            <span className="font-pixel text-xs text-foreground">LV {level}</span>
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-sm bg-muted">
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${xpProgress}%` }}
        />
      </div>
    </header>
  )
}
