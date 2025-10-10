"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CategoryFilter from "@/components/category-filter"
import MovieFilters from "@/components/movie-filters"
import WhatsAppButton from "@/components/whatsapp-button"

export default function RwandanMoviesPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cinemax-8yem.onrender.com"
  const [sortBy, setSortBy] = useState("newest")
  const [region, setRegion] = useState("Rwandan")
  const [translator, setTranslator] = useState("All")
  const [genre, setGenre] = useState("All")
  const [movies, setMovies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (region !== "All") params.append("region", region)
        if (translator !== "All") params.append("translator", translator)
        if (genre !== "All") params.append("category", genre)
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
  }, [API_BASE, region, translator, genre, sortBy])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />
      <br />
      <br />
      <br />
      <br />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Home
            </Button>
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-300">Rwandan Movies</span>
        </div>

        <h1 className="text-3xl font-bold mb-6">Rwandan Movies</h1>

        <MovieFilters onRegionChange={setRegion} onTranslatorChange={setTranslator} onGenreChange={setGenre} />

        <CategoryFilter onCategoryChange={() => {}} onSortChange={setSortBy} hideCategories />

        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {(isLoading ? Array.from({ length: 12 }) : movies).map((movie: any, idx: number) => (
            <div key={movie?.id || idx}>
              {isLoading ? (
                <div className="animate-pulse h-[270px] bg-gray-800 rounded-md" />
              ) : (
                <Link href={`/movie/${movie.id}`} className="group">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105">
                    <Image src={movie.posterImage || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium truncate">{movie.title}</h3>
                  <p className="text-xs text-gray-400">{movie.year}</p>
                </Link>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Button */}
      
    </div>
  )
}

