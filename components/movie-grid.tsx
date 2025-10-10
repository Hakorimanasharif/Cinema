"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import MovieCard from "@/components/movie-card"

interface MovieGridProps {
  category: string
  sortBy?: string
}

export default function MovieGrid({ category, sortBy = "newest" }: MovieGridProps) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cinemax-8yem.onrender.com"
  const [showAll, setShowAll] = useState(false)
  const [movies, setMovies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (category === "trending") {
          params.append("sort", "trending")
        } else if (category === "newest") {
          params.append("sort", "newest")
        } else if (category) {
          params.append("category", category)
        }
        if (sortBy !== "newest") {
          params.append("sort", sortBy)
        }
        const url = params.toString() ? `${API_BASE}/api/movies?${params.toString()}` : `${API_BASE}/api/movies`
        const res = await fetch(url)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Failed to fetch movies")
        const mapped = data.map((m: any) => ({
          id: m._id,
          title: m.title,
          year: m.year,
          posterImage: m.coverImage,
          trailerYouTubeId: m.trailerYouTubeId,
          translator: typeof m.translator === 'object' ? m.translator?.name : m.translator,
        }))
        setMovies(mapped)
      } catch (e: any) {
        setError(e?.message || "Failed to load movies")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [API_BASE, category, sortBy])

  const displayedMovies = showAll ? movies : movies.slice(0, 12)

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {(isLoading ? Array.from({ length: 12 }) : displayedMovies).map((movie: any, idx: number) => (
          <div key={movie?.id || idx}>
            {isLoading ? (
              <div className="animate-pulse h-[270px] bg-gray-800 rounded-md" />
            ) : (
              <MovieCard movie={movie} />
            )}
          </div>
        ))}
      </div>

      {movies.length > 12 && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="border-red-600 text-red-600 hover:bg-red-600/10"
          >
            {showAll ? "Show Less" : "View More"}
          </Button>
        </div>
      )}
    </div>
  )
}

