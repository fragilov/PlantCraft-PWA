'use client'

import { useState, useMemo } from 'react'
import { ShopItem, SHOP_ITEMS, useGameStore } from '@/lib/store'
import { ShopItemCard } from '@/components/shop-item-card'
import { ItemDetailSheet } from '@/components/item-detail-sheet'
import { cn } from '@/lib/utils'

type FilterCategory = 'all' | ShopItem['category'] | 'rare'

const FILTER_OPTIONS: { value: FilterCategory; label: string; icon: string }[] = [
  { value: 'all', label: 'All', icon: '🎁' },
  { value: 'hat', label: 'Hats', icon: '🎩' },
  { value: 'glasses', label: 'Glasses', icon: '👓' },
  { value: 'block', label: 'Blocks', icon: '🟫' },
  { value: 'vfx', label: 'Effects', icon: '✨' },
  { value: 'rare', label: 'Rare', icon: '🔒' },
]

export default function ShopPage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all')
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)
  const { coins } = useGameStore()

  const filteredItems = useMemo(() => {
    if (selectedFilter === 'all') return SHOP_ITEMS
    if (selectedFilter === 'rare') {
      return SHOP_ITEMS.filter((item) => item.rarity === 'rare' || item.rarity === 'legendary')
    }
    return SHOP_ITEMS.filter((item) => item.category === selectedFilter)
  }, [selectedFilter])

  return (
    <div className="min-h-full px-4 py-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-pixel text-xs text-foreground">Item Shop</h2>
        <div className="flex items-center gap-1.5">
          <span className="text-lg">💰</span>
          <span className="font-pixel text-xs text-accent">{coins} GC</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedFilter(option.value)}
            className={cn(
              'flex flex-shrink-0 items-center gap-1.5 rounded-sm border-2 px-3 py-1.5 transition-colors',
              selectedFilter === option.value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-foreground hover:border-primary'
            )}
          >
            <span className="text-sm">{option.icon}</span>
            <span className="font-pixel text-[8px]">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-4xl">🏪</span>
          <p className="mt-2 font-pixel text-[10px] text-muted-foreground">
            No items in this category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      )}

      {/* Item Detail Sheet */}
      <ItemDetailSheet
        item={selectedItem}
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      />
    </div>
  )
}
