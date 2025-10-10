"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import MovieFilters from "@/components/movie-filters"
import CategoryFilter from "@/components/category-filter"
import MovieCard from "@/components/movie-card"

interface GenrePageProps {
  params: {
    slug: string
  }
}

export default function GenrePage({ params }: GenrePageProps) {
  const { slug } = params
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cinemax-8yem.onrender.com"
  const [sortBy, setSortBy] = useState("newest")
  const [region, setRegion] = useState("All")
  const [translator, setTranslator] = useState("All")
  const [movies, setMovies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Capitalize first letter for display
  const genreName = slug.charAt(0).toUpperCase() + slug.slice(1)

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ category: genreName })
        if (region !== "All") params.append("region", region)
        if (translator !== "All") params.append("translator", translator)
        if (sortBy !== "newest") params.append("sort", sortBy)
        const res = await fetch(`${API_BASE}/api/movies?${params.toString()}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Failed to fetch movies")
        setMovies(data.map((m: any) => ({
          id: m._id,
          title: m.title,
          year: m.year,
          posterImage: m.coverImage,
          trailerYouTubeId: m.trailerYouTubeId,
        })))
      } catch (e: any) {
        setError(e?.message || "Failed to load movies")
      } finally {
        setIsLoading(false)
      }
    }
    loadMovies()
  }, [API_BASE, genreName, region, translator, sortBy])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Home
            </Button>
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-300">{genreName} Movies</span>
        </div>

        <h1 className="text-3xl font-bold mb-6">{genreName} Movies</h1>

        <MovieFilters
          onRegionChange={setRegion}
          onTranslatorChange={setTranslator}
          onGenreChange={() => {}}
          initialGenre={genreName}
        />

        <CategoryFilter onCategoryChange={() => {}} onSortChange={setSortBy} hideCategories />

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {(isLoading ? Array.from({ length: 12 }) : movies).map((movie: any, idx: number) => (
              <div key={movie?.id || idx}>
                {isLoading ? (
                  <div className="animate-pulse h-[270px] bg-gray-800 rounded-md" />
                ) : (
                  <MovieCard movie={movie} />
                )}
              </div>
            ))}
          </div>
        ) : !isLoading && (
          <div className="text-center py-12 bg-gray-900 rounded-lg">
            <p className="text-xl text-gray-400 mb-2">No movies found in this genre</p>
            <p className="text-sm text-gray-500 mb-6">Try a different genre or browse our categories</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

