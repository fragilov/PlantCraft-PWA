'use client'

import { ShopItem, useGameStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface ShopItemCardProps {
  item: ShopItem
  onClick: () => void
}

// Simple isometric placeholder icons for items
const ItemPreview = ({ item }: { item: ShopItem }) => {
  const getItemColor = () => {
    switch (item.category) {
      case 'hat': return '#E8C547'
      case 'glasses': return '#5C8A3C'
      case 'block': return '#8B7355'
      case 'vfx': return '#A855F7'
      default: return '#5C8A3C'
    }
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center">
      <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
        {item.category === 'hat' && (
          <>
            <rect x="8" y="16" width="16" height="4" fill={getItemColor()} />
            <rect x="10" y="12" width="12" height="4" fill={getItemColor()} />
            <rect x="12" y="8" width="8" height="4" fill={getItemColor()} />
            <rect x="8" y="16" width="16" height="1" fill="#FFF" opacity="0.3" />
          </>
        )}
        {item.category === 'glasses' && (
          <>
            <rect x="4" y="12" width="10" height="8" fill={getItemColor()} />
            <rect x="18" y="12" width="10" height="8" fill={getItemColor()} />
            <rect x="14" y="14" width="4" height="4" fill={getItemColor()} />
            <rect x="6" y="14" width="6" height="4" fill="#1a1a1a" />
            <rect x="20" y="14" width="6" height="4" fill="#1a1a1a" />
          </>
        )}
        {item.category === 'block' && (
          <>
            <rect x="8" y="8" width="16" height="16" fill={getItemColor()} />
            <rect x="8" y="8" width="16" height="4" fill="#FFF" opacity="0.2" />
            <rect x="8" y="8" width="4" height="16" fill="#FFF" opacity="0.1" />
            <rect x="20" y="8" width="4" height="16" fill="#000" opacity="0.2" />
          </>
        )}
        {item.category === 'vfx' && (
          <>
            <circle cx="16" cy="16" r="10" fill={getItemColor()} opacity="0.3" />
            <circle cx="16" cy="16" r="6" fill={getItemColor()} opacity="0.5" />
            <circle cx="16" cy="16" r="3" fill={getItemColor()} />
            <rect x="10" y="8" width="2" height="2" fill="#FFF" />
            <rect x="20" y="12" width="2" height="2" fill="#FFF" />
            <rect x="14" y="22" width="2" height="2" fill="#FFF" />
          </>
        )}
      </svg>
    </div>
  )
}

export function ShopItemCard({ item, onClick }: ShopItemCardProps) {
  const { coins, ownedItems } = useGameStore()
  const isOwned = ownedItems.some((o) => o.itemId === item.id)
  const canAfford = coins >= item.price

  const isNew = () => {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return new Date(item.createdAt) > sevenDaysAgo
  }

  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center rounded-sm border-2 border-border bg-card p-3 transition-all hover:border-primary hover:shadow-md active:scale-[0.98]"
    >
      {/* Badges */}
      <div className="absolute left-1 top-1 flex flex-col gap-1">
        {isNew() && (
          <span className="rounded-sm bg-accent px-1.5 py-0.5 font-pixel text-[6px] text-accent-foreground">
            NEW
          </span>
        )}
        {item.rarity === 'rare' && (
          <span className="rounded-sm bg-purple-500 px-1.5 py-0.5 font-pixel text-[6px] text-white">
            RARE
          </span>
        )}
        {item.rarity === 'legendary' && (
          <span className="rounded-sm bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 py-0.5 font-pixel text-[6px] text-white">
            LEGEND
          </span>
        )}
      </div>

      {/* Owned Badge */}
      {isOwned && (
        <div className="absolute right-1 top-1 rounded-sm bg-primary px-1.5 py-0.5 font-pixel text-[6px] text-primary-foreground">
          OWNED
        </div>
      )}

      {/* Item Preview */}
      <ItemPreview item={item} />

      {/* Item Name */}
      <h3 className="mt-2 text-center font-pixel text-[8px] text-foreground line-clamp-1">
        {item.name}
      </h3>

      {/* Price */}
      <div className={cn(
        'mt-1.5 flex items-center gap-1 font-pixel text-[10px]',
        isOwned ? 'text-primary' : canAfford ? 'text-accent' : 'text-muted-foreground'
      )}>
        {isOwned ? (
          <span>Owned</span>
        ) : (
          <>
            <span>💰</span>
            <span>{item.price} GC</span>
          </>
        )}
      </div>
    </button>
  )
}
