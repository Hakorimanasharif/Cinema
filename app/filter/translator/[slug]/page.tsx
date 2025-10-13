"use client"

import { useState, use, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, Play, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import MovieFilters from "@/components/movie-filters"
import CategoryFilter from "@/components/category-filter"
import TrailerButton from "@/components/trailer-button"
import Image from "next/image"

interface Movie {
  _id: string;
  id: string;
  title: string;
  description?: string;
  year?: number;
  duration?: string;
  rating?: string;
  coverImage?: string;
  posterImage?: string;
  trailerYouTubeId?: string;
  category?: string;
  region?: string;
  translator?: string;
  videoUrl?: string;
  views?: number;
}

interface TranslatorPageProps {
  params: Promise<{
    slug: string
  }>
}

// MovieCard Component (copied from your code)
function MovieCard({ movie, className = "" }: { movie: Movie; className?: string }) {
  return (
    <div className={`group/card flex-none ${className}`}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-md transition-transform duration-300 group-hover/card:scale-105">
        <Image
          src={movie.id === "25" ? "/images/fast-x.jpg" : movie.posterImage || movie.coverImage || "/placeholder.svg"}
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
          <Mic className="w-3 h-3" />
          {movie.translator}
        </p>
      )}
    </div>
  )
}

export default function TranslatorPage({ params }: TranslatorPageProps) {
  const { slug } = use(params)
  const [sortBy, setSortBy] = useState("newest")
  const [region, setRegion] = useState("All")
  const [genre, setGenre] = useState("All")
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [translatorData, setTranslatorData] = useState<any>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cinemax-8yem.onrender.com"

  // Format translator name for display (replace hyphens with spaces and capitalize)
  const translatorName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true)
      try {
        // Fetch translator data
        const translatorRes = await fetch(`${API_BASE}/api/translators`)
        let translatorInfo = null
        if (translatorRes.ok) {
          const translators = await translatorRes.json()
          translatorInfo = translators.find((t: any) => t.name.toLowerCase() === translatorName.toLowerCase())
          setTranslatorData(translatorInfo)
        }

        // Fetch movies
        const res = await fetch(`${API_BASE}/api/movies?translator=${encodeURIComponent(translatorName)}`)
        if (res.ok) {
          const data = await res.json()
          setMovies(data.map((m: any) => ({ 
            ...m, 
            id: m._id,
            // Ensure posterImage falls back to coverImage
            posterImage: m.posterImage || m.coverImage
          })))
        } else {
          setMovies([])
        }
      } catch (error) {
        console.error('Failed to fetch movies', error)
        setMovies([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchMovies()
  }, [translatorName, API_BASE])

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
          <span className="text-gray-300">{translatorName} Translations</span>
        </div>

        <div className="flex items-center gap-4 mb-6">
          {translatorData?.avatar && (
            <img
              src={translatorData.avatar}
              alt={translatorName}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">Movies Translated by {translatorName}</h1>
            {translatorData && (
              <p className="text-gray-400 mt-1">
                {translatorData.language && `Language: ${translatorData.language}`}
                {translatorData.movieCount !== undefined && ` • ${translatorData.movieCount} movies`}
              </p>
            )}
          </div>
        </div>

        <MovieFilters
          onRegionChange={setRegion}
          onTranslatorChange={() => {}}
          onGenreChange={setGenre}
          initialTranslator={translatorName}
        />

        <CategoryFilter onCategoryChange={() => {}} onSortChange={setSortBy} hideCategories />

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-gray-400">Loading movies...</div>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-900 rounded-lg">
            <p className="text-xl text-gray-400 mb-2">No movies found for this translator</p>
            <p className="text-sm text-gray-500 mb-6">Try a different translator or browse our categories</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}