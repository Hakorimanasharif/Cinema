"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void
  onSortChange: (sortBy: string) => void
  hideCategories?: boolean
}

export default function CategoryFilter({
  onCategoryChange,
  onSortChange,
  hideCategories = false,
}: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState("popular")
  const [sortBy, setSortBy] = useState("newest")

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    onCategoryChange(category)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    onSortChange(sort)
  }

  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between w-full mb-6">
      {!hideCategories && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === "popular" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick("popular")}
            className={activeCategory === "popular" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            Popular
          </Button>
          <Button
            variant={activeCategory === "new" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick("new")}
            className={activeCategory === "new" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            New Releases
          </Button>
          <Button
            variant={activeCategory === "action" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick("action")}
            className={activeCategory === "action" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            Action
          </Button>
          <Button
            variant={activeCategory === "comedy" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick("comedy")}
            className={activeCategory === "comedy" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            Comedy
          </Button>
          <Button
            variant={activeCategory === "drama" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick("drama")}
            className={activeCategory === "drama" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            Drama
          </Button>
          <Button
            variant={activeCategory === "animation" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick("animation")}
            className={activeCategory === "animation" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            Animation
          </Button>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={hideCategories ? "" : "ml-auto"}>
            Sort by:{" "}
            {sortBy === "newest" ? "Newest" : sortBy === "oldest" ? "Oldest" : sortBy === "rating" ? "Rating" : "A-Z"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleSortChange("newest")}>Newest</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange("oldest")}>Oldest</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange("rating")}>Rating</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSortChange("a-z")}>A-Z</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

