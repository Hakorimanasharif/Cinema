"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CategoryFilter from "@/components/category-filter"
import MovieFilters from "@/components/movie-filters"
import TrailerButton from "@/components/trailer-button"
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
      {/* Header */}
      <Header />

      <main className="pt-16">
        {/* Hero Banner */}
        <section className="relative h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
          <Image src="https://i.pinimg.com/736x/02/bc/a6/02bca64a6ca17639d41a0623ce529e1a.jpg" alt="Rwandan Movies" fill className="object-cover" priority />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Rwandan Movies</h1>
            <p className="text-sm md:text-base text-gray-300 mb-6 max-w-2xl">
              Discover the rich cinematic heritage of Rwanda. From local productions to international collaborations, explore our collection of Rwandan films.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/category/rwandan">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Browse Rwandan Movies
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
            <span className="text-gray-300">Rwandan Movies</span>
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
                  <div className="group/card flex-none">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-md transition-transform duration-300 group-hover/card:scale-105">
                      <Image
                        src={movie.posterImage || "/placeholder.svg"}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/60 transition-colors duration-300 flex flex-col items-center justify-center opacity-0 group-hover/card:opacity-100">
                        <Link href={`/play/${movie.id}`}>
                          <Button size="icon" className="rounded-full bg-red-600 hover:bg-red-700 mb-2">
                            <Play className="h-5 w-5 fill-white" />
                          </Button>
                        </Link>
                        {movie.trailerYouTubeId && <TrailerButton videoId={movie.trailerYouTubeId} />}
                      </div>
                    </div>
                    <h3 className="mt-2 text-sm font-medium truncate">{movie.title}</h3>
                    <p className="text-xs text-gray-400">{movie.year}</p>
                    {movie.translator && (
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <span className="w-3 h-3 bg-gray-600 rounded-full flex items-center justify-center text-[8px] font-bold">M</span>
                        {movie.translator}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Button */}

    </div>
  )
}
