"use client"

import { Button } from "@/components/ui/button"

interface ExploreHeaderProps {
  onFilterChange: (filter: string) => void
  activeFilter: string
}

export default function ExploreHeader({ onFilterChange, activeFilter }: ExploreHeaderProps) {
  const filters = [
    { id: "trending", label: "Trending" },
    { id: "fashion", label: "Fashion" },
    { id: "beauty", label: "Beauty" },
    { id: "lifestyle", label: "Lifestyle" },
    { id: "tech", label: "Tech" },
  ]

  return (
    <div className="bg-purple-600 text-white p-4 rounded-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold">Explore Influencers</h1>
          <p className="text-purple-100">Discover top influencers by category, tier, and more.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "secondary" : "outline"}
              className={
                activeFilter === filter.id
                  ? "bg-white text-purple-600"
                  : "bg-transparent text-white border-white hover:bg-white/10"
              }
              onClick={() => onFilterChange(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}