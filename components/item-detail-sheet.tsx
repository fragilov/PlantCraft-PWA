'use client'

import { ShopItem, useGameStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface ItemDetailSheetProps {
  item: ShopItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Rotating item preview
const RotatingPreview = ({ item }: { item: ShopItem }) => {
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
    <div className="flex h-32 w-32 items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
      <svg width="96" height="96" viewBox="0 0 32 32" fill="none">
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
          </>
        )}
      </svg>
    </div>
  )
}

const CATEGORY_LABELS: Record<ShopItem['category'], string> = {
  hat: 'Hat',
  glasses: 'Glasses',
  block: 'Block',
  vfx: 'Effect',
}

export function ItemDetailSheet({ item, open, onOpenChange }: ItemDetailSheetProps) {
  const { coins, ownedItems, purchaseItem } = useGameStore()
  
  if (!item) return null

  const isOwned = ownedItems.some((o) => o.itemId === item.id)
  const canAfford = coins >= item.price

  const handlePurchase = () => {
    if (purchaseItem(item.id, item.price)) {
      // Success feedback could be added here
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[80vh] rounded-t-lg border-t-2 border-primary bg-card">
        <SheetHeader className="text-center">
          <SheetTitle className="font-pixel text-sm text-primary">
            {item.name}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            {CATEGORY_LABELS[item.category]} • {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col items-center">
          {/* Rotating Preview */}
          <div className="rounded-sm border-2 border-border bg-muted p-4">
            <RotatingPreview item={item} />
          </div>

          {/* Description */}
          <p className="mt-4 text-center text-sm text-muted-foreground leading-relaxed">
            {item.description}
          </p>

          {/* Price & Balance */}
          <div className="mt-4 flex items-center gap-4 text-center">
            <div>
              <span className="font-pixel text-[8px] text-muted-foreground">Price</span>
              <div className="font-pixel text-sm text-accent">
                💰 {item.price} GC
              </div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <span className="font-pixel text-[8px] text-muted-foreground">Balance</span>
              <div className={cn(
                'font-pixel text-sm',
                canAfford ? 'text-primary' : 'text-destructive'
              )}>
                💰 {coins} GC
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={handlePurchase}
            disabled={isOwned || !canAfford}
            className={cn(
              'mt-6 w-full rounded-sm font-pixel text-xs',
              isOwned
                ? 'bg-primary text-primary-foreground'
                : canAfford
                ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {isOwned
              ? '✅ Already Owned'
              : canAfford
              ? '💰 Buy Now'
              : '🔒 Not Enough Coins'}
          </Button>

          {/* Not enough coins message */}
          {!isOwned && !canAfford && (
            <p className="mt-2 text-center font-pixel text-[8px] text-muted-foreground">
              Need {item.price - coins} more coins
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
