'use client'

import { Button } from '@/components/ui/button'

interface EmptyGardenProps {
  onAddPlant: () => void
}

// Pixel art empty pot SVG
const EmptyPotIcon = () => (
  <svg width="96" height="96" viewBox="0 0 32 32" fill="none" className="mx-auto">
    {/* Pot body */}
    <rect x="6" y="16" width="20" height="12" fill="#8B7355" />
    <rect x="8" y="28" width="16" height="2" fill="#6B5344" />
    <rect x="4" y="14" width="24" height="2" fill="#A08060" />
    
    {/* Pot rim highlight */}
    <rect x="6" y="14" width="20" height="1" fill="#B89070" />
    
    {/* Soil */}
    <rect x="8" y="16" width="16" height="3" fill="#4A3728" />
    
    {/* Tiny sprout */}
    <rect x="15" y="12" width="2" height="4" fill="#5C8A3C" />
    <rect x="13" y="10" width="2" height="2" fill="#6B9B4B" />
    <rect x="17" y="10" width="2" height="2" fill="#6B9B4B" />
    
    {/* Sparkles */}
    <rect x="10" y="6" width="2" height="2" fill="#E8C547" opacity="0.8" />
    <rect x="22" y="8" width="2" height="2" fill="#E8C547" opacity="0.6" />
    <rect x="6" y="10" width="2" height="2" fill="#E8C547" opacity="0.4" />
  </svg>
)

export function EmptyGarden({ onAddPlant }: EmptyGardenProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <EmptyPotIcon />
      
      <h2 className="mt-6 font-pixel text-sm text-foreground">
        Your garden is empty!
      </h2>
      
      <p className="mt-2 max-w-xs text-sm text-muted-foreground leading-relaxed">
        Add your first plant to start your PlantCraft journey. Earn coins, level up, and decorate with AR!
      </p>
      
      <Button
        onClick={onAddPlant}
        className="mt-6 rounded-sm bg-primary px-6 font-pixel text-xs text-primary-foreground hover:bg-primary/90"
      >
        🌱 Add First Plant
      </Button>
    </div>
  )
}
