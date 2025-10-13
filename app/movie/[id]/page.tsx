"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Play, Download, Plus, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import TrailerButton from "@/components/trailer-button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import MovieComments from "@/components/movie-comments"
import MovieCard from "@/components/movie-card"
import LoadingSpinner from "@/components/loading-spinner"

interface MoviePageProps {
  params: Promise<{
    id: string
  }>
}

export default function MoviePage({ params }: MoviePageProps) {
  const { id } = use(params)
  const [isLoading, setIsLoading] = useState(false)
  const [movie, setMovie] = useState<any>(null)
  const [relatedMovies, setRelatedMovies] = useState<any[]>([])
  const [loadingMovie, setLoadingMovie] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cinemax-8yem.onrender.com"

  useEffect(() => {
    const loadMovie = async () => {
      setLoadingMovie(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/api/movies/${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Movie not found")
        setMovie({
          id: data._id,
          title: data.title,
          description: data.description,
          year: data.year,
          duration: data.duration,
          rating: data.rating,
          coverImage: data.coverImage,
          posterImage: data.coverImage, // assuming same
          trailerYouTubeId: data.trailerYouTubeId,
          category: data.category,
          region: data.region,
          translator: data.translator,
          cast: [], // backend doesn't have cast
          director: "", // backend doesn't have director
          genres: data.category ? [data.category] : [], // approximate
        })

        // Load related movies (same category)
        if (data.category) {
          const relatedRes = await fetch(`${API_BASE}/api/movies?category=${encodeURIComponent(data.category)}`)
          const relatedData = await relatedRes.json()
          if (relatedRes.ok) {
            const mapped = relatedData.filter((m: any) => m._id !== data._id).slice(0, 6).map((m: any) => ({
              id: m._id,
              title: m.title,
              year: m.year,
              posterImage: m.coverImage,
              trailerYouTubeId: m.trailerYouTubeId,
            }))
            setRelatedMovies(mapped)
          }
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load movie")
      } finally {
        setLoadingMovie(false)
      }
    }
    loadMovie()
  }, [id, API_BASE])

  if (loadingMovie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !movie) {
    notFound()
  }

  const handleDownload = () => {
    if (!movie.videoUrl) return
    setIsLoading(true)

    // Simulate download delay
    setTimeout(() => {
      const link = document.createElement("a")
      link.href = movie.videoUrl
      link.download = `${movie.title.replace(/\s+/g, "_")}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsLoading(false)
    }, 1500)
  }

  const handleShare = async () => {
    const url = window.location.href
    const title = `Watch ${movie.title} on Cinemax`

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!')
      }).catch(() => {
        alert('Failed to copy link')
      })
    }
  }
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <main className="pt-16">
        {/* Movie Banner */}
        <div className="relative h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
          <Image
            src={movie.id === "25" ? "/images/banner1.jpg" : movie.coverImage}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20 max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
              <span>{movie.year}</span>
              <span>{movie.duration}</span>
              <span>{movie.rating}</span>
              {movie.region && <span>{movie.region}</span>}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/play/${movie.id}`}>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Play className="mr-2 h-4 w-4 fill-white" /> Watch Now
                </Button>
              </Link>
              {movie.trailerYouTubeId && <TrailerButton videoId={movie.trailerYouTubeId} variant="default" />}
            </div>
          </div>
        </div>

        {/* Movie Details */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                <Image
                  src={movie.id === "25" ? "/images/fast-x.jpg" : movie.posterImage || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Link href={`/play/${movie.id}`}>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <Play className="mr-2 h-4 w-4" /> Watch Now
                  </Button>
                </Link>
                {movie.trailerYouTubeId && (
                  <TrailerButton videoId={movie.trailerYouTubeId} variant="default" className="w-full" />
                )}
                <Link href={`/download/${movie.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download Options
                  </Button>
                </Link>

                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add to List
                </Button>
                <Button variant="outline" className="w-full" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
            </div>
            <div className="md:w-3/4">
              <p className="text-gray-300 mb-6">{movie.description}</p>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Cast</h2>
                <p className="text-gray-300">{movie.cast.join(", ")}</p>
              </div>



              <div>
                <h2 className="text-xl font-bold mb-2">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre: string) => (
                    <span key={genre} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {movie.translator && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold mb-2">Translator</h2>
                  <p className="text-gray-300">{movie.translator}</p>
                </div>
              )}

              {/* User Rating Section */}
              <div className="mt-8 p-4 bg-gray-800 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Rate This Movie</h2>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="text-2xl text-yellow-400 hover:scale-110 transition-transform">
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-gray-400">(Click to rate)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <MovieComments movieId={movie.id} movieTitle={movie.title} moviePoster={movie.coverImage} />

          {/* Related Movies */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {relatedMovies.map((relatedMovie) => (
                <MovieCard key={relatedMovie.id} movie={relatedMovie} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
