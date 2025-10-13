"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import CategoryFilter from "@/components/category-filter"
import MovieFilters from "@/components/movie-filters"
import Header from "@/components/header"
import Footer from "@/components/footer"
import MovieCard from "@/components/movie-card"

export default function AnimationPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cinemax-8yem.onrender.com"
  const [sortBy, setSortBy] = useState("newest")
  const [region, setRegion] = useState("All")
  const [translator, setTranslator] = useState("All")
  const [genre, setGenre] = useState("Animation")
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
        else params.append("category", "Animation") // default to Animation
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
          translator: m.translator,
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
      <Header />

      <main className="pt-16">
        {/* Hero Banner */}
        <section className="relative h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
          <Image src="https://i.pinimg.com/1200x/7a/6d/c4/7a6dc4222a7bd3037d9f7146314e3bc7.jpg" alt="Animation Movies" fill className="object-cover" priority />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Animation Movies</h1>
            <p className="text-sm md:text-base text-gray-300 mb-6 max-w-2xl">
              Discover the best animated movies from around the world. From Disney classics to indie animations, explore our collection.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/category/animation">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Browse Animation
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="p-0 h-auto">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Home
              </Button>
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-300">Animation</span>
          </div>

          <MovieFilters onRegionChange={setRegion} onTranslatorChange={setTranslator} onGenreChange={setGenre} />

          <CategoryFilter onCategoryChange={() => {}} onSortChange={setSortBy} hideCategories />

          {error && <p className="text-sm text-red-500">{error}</p>}
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
        </div>
      </main>

      <Footer />
    </div>
  )
}
