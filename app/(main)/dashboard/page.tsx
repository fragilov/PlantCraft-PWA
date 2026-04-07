'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/store'
import { PlantCard } from '@/components/plant-card'
import { EmptyGarden } from '@/components/empty-garden'
import { AddPlantModal } from '@/components/add-plant-modal'
import { CareHistorySheet } from '@/components/care-history-sheet'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const { plants } = useGameStore()

  return (
    <div className="min-h-full px-4 py-4">
      {/* Section Title */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-pixel text-xs text-foreground">My Garden</h2>
        <span className="font-pixel text-[8px] text-muted-foreground">
          {plants.length} plant{plants.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Plants List or Empty State */}
      {plants.length === 0 ? (
        <EmptyGarden onAddPlant={() => setIsAddModalOpen(true)} />
      ) : (
        <div className="space-y-3">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {plants.length > 0 && (
        <div className="mt-6 space-y-2">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full rounded-sm bg-primary font-pixel text-xs text-primary-foreground hover:bg-primary/90"
          >
            ➕ Add New Plant
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsHistoryOpen(true)}
            className="w-full rounded-sm border-2 border-primary font-pixel text-xs text-foreground hover:bg-secondary"
          >
            📋 Care History
          </Button>
        </div>
      )}

      {/* Modals */}
      <AddPlantModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
      <CareHistorySheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen} />
    </div>
  )
}
