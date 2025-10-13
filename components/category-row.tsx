"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import MovieCard from "@/components/movie-card"

interface CategoryRowProps {
  title: string
  category: string
  type?: "movie" | "series"
  region?: string
  translator?: string
  genre?: string
}

export default function CategoryRow({ title, category, type = "movie", region, translator, genre }: CategoryRowProps) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cinemax-8yem.onrender.com"
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        let url = `${API_BASE}/api/${type === 'series' ? 'series' : 'movies'}`
        const params = new URLSearchParams()
        if (category === "trending" || category === "popular") {
          params.append("sort", "trending")
        } else if (category === "newest" || category === "new") {
          params.append("sort", "newest")
        } else if (category) {
          params.append("category", category)
        }
        if (region && region !== "All") {
          params.append("region", region)
        }
        if (translator && translator !== "All") {
          params.append("translator", translator)
        }
        if (genre && genre !== "All") {
          params.append("category", genre)
        }
        if (params.toString()) {
          url += `?${params.toString()}`
        }
        const res = await fetch(url)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Failed to fetch items")
        const mapped = data.map((item: any) => ({
          id: item._id,
          title: item.title,
          year: item.year,
          posterImage: item.coverImage,
          trailerYouTubeId: item.trailerYouTubeId,
        }))
        setItems(mapped)
      } catch (e: any) {
        setError(e?.message || "Failed to load items")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [API_BASE, category, type, region, translator, genre])

  const rowRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 1.5 : scrollLeft + clientWidth / 1.5

      rowRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      })
    }
  }

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <Link href={type === "series" ? "/series" : `/category/${category}`}>
          <Button variant="link" className="text-red-500 hover:text-red-400">
            View All
          </Button>
        </Link>
      </div>

      <div className="relative group/row">
        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/70 p-2 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div
          ref={rowRef}
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
          onScroll={handleScroll}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {(isLoading ? Array.from({ length: 6 }) : items).map((item: any, idx: number) => (
            <div key={item?.id || idx} className="w-[180px]">
              {isLoading ? (
                <div className="animate-pulse h-[270px] bg-gray-800 rounded-md" />
              ) : (
                <MovieCard movie={item} className="w-[180px]" />
              )}
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/70 p-2 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  )
}