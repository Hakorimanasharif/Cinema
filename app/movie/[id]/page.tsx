"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Play, Download, Plus, Share2, Star, Clock, Calendar, Users, Languages, ThumbsUp, Film } from "lucide-react"
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
  const [userRating, setUserRating] = useState(0)
  const [isInWatchlist, setIsInWatchlist] = useState(false)

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
          posterImage: data.coverImage,
          trailerYouTubeId: data.trailerYouTubeId,
          category: data.category,
          region: data.region,
          translator: data.translator,
          videoUrl: data.videoUrl,
          views: data.views,
          cast: [],
          director: "",
          genres: data.category ? [data.category] : [],
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

  const handleDownload = async () => {
    if (!movie.videoUrl) return
    setIsLoading(true)

    try {
      // Track download
      await fetch(`${API_BASE}/api/stats/download`, {
        method: 'POST',
      })
    } catch (error) {
      console.error("Failed to track download", error)
    }

    try {
      const response = await fetch(movie.videoUrl)
      if (!response.ok) throw new Error('Failed to fetch file')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${movie.title.replace(/\s+/g, "_")}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
      // Fallback to direct link
      window.open(movie.videoUrl, '_blank')
    } finally {
      setIsLoading(false)
    }
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

  const handleRating = async (rating: number) => {
    if (!movie) return
    try {
      const res = await fetch(`${API_BASE}/api/movies/${id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating })
      })
      if (res.ok) {
        setUserRating(rating)
      }
    } catch (error) {
      console.error('Failed to submit rating:', error)
    }
  }

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist)
    // Here you would typically make an API call to update the user's watchlist
  }

  if (loadingMovie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-400">Loading movie details...</p>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <main className="pt-16">
        {/* Netflix-style Hero Banner */}
        <div className="relative h-[70vh] min-h-[600px] overflow-hidden">
          {/* Background Image with Enhanced Gradient */}
          <div className="absolute inset-0">
            <Image
              src={movie.coverImage || "/placeholder.svg"}
              alt={movie.title}
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-transparent z-10" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-20 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-8 w-full">
              <div className="max-w-2xl">
                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight 
                             bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent
                             drop-shadow-2xl font-['Bebas_Neue'] leading-tight">
                  {movie.title}
                </h1>

                {/* Movie Info Badges */}
                <div className="flex items-center gap-4 mb-6 flex-wrap">
                  <div className="flex items-center gap-2 bg-red-600/20 px-3 py-1 rounded-full border border-red-600/30">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm font-semibold">{movie.rating}/10</span>
                  </div>
                  {movie.year && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{movie.year}</span>
                    </div>
                  )}
                  {movie.duration && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{movie.duration}</span>
                    </div>
                  )}
                  {movie.views && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{movie.views} Views</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-3xl drop-shadow-lg">
                  {movie.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <Link href={`/play/${movie.id}`}>
                    <Button 
                      size="lg" 
                      className="bg-red-600 hover:bg-red-700 px-8 py-6 text-lg font-semibold
                               transform hover:scale-105 transition-all duration-300
                               shadow-lg shadow-red-600/25 hover:shadow-red-600/40"
                    >
                      <Play className="mr-3 h-5 w-5 fill-white" /> 
                      Watch Now
                    </Button>
                  </Link>
                  
                  {movie.trailerYouTubeId && (
                    <TrailerButton 
                      videoId={movie.trailerYouTubeId} 
                      className="bg-transparent hover:bg-white/10 border-2 border-white/30 
                               text-white px-8 py-6 text-lg font-semibold
                               backdrop-blur-sm hover:border-white/50
                               transform hover:scale-105 transition-all duration-300"
                    />
                  )}

                  <Button 
                    variant="ghost"
                    onClick={toggleWatchlist}
                    className={`text-white hover:text-white px-6 py-6 text-lg backdrop-blur-sm border border-transparent hover:border-white/20 transform hover:scale-105 transition-all duration-300 ${
                      isInWatchlist ? 'bg-green-600/20 border-green-500/30' : 'hover:bg-white/10'
                    }`}
                  >
                    <Plus className={`mr-2 h-5 w-5 ${isInWatchlist ? 'fill-green-400 text-green-400' : ''}`} />
                    {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="flex items-center gap-6 text-gray-300 text-sm">
                  {movie.region && (
                    <div className="flex items-center gap-2">
                      <span>🌍</span>
                      <span>{movie.region}</span>
                    </div>
                  )}
                  {movie.translator && (
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4" />
                      <span>{movie.translator}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Movie Details Section */}
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-gray-700/50 shadow-2xl">
                  <Image
                    src={movie.posterImage || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link href={`/play/${movie.id}`} className="block">
                      <Button className="w-full bg-red-600 hover:bg-red-700 justify-start">
                        <Play className="mr-3 h-4 w-4 fill-white" />
                        Watch Movie
                      </Button>
                    </Link>
                    
                    {movie.trailerYouTubeId && (
                      <TrailerButton 
                        videoId={movie.trailerYouTubeId}
                        className="w-full justify-start border-gray-600 text-white hover:bg-white/10"
                        variant="outline"
                      />
                    )}

                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-gray-600 text-white hover:bg-white/10"
                      onClick={handleDownload}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner size="sm" color="white" className="mr-2" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="mr-3 h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-gray-600 text-white hover:bg-white/10"
                      onClick={toggleWatchlist}
                    >
                      <Plus className={`mr-3 h-4 w-4 ${isInWatchlist ? 'fill-green-400 text-green-400' : ''}`} />
                      {isInWatchlist ? 'In Watchlist' : 'Add to List'}
                    </Button>

                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-gray-600 text-white hover:bg-white/10"
                      onClick={handleShare}
                    >
                      <Share2 className="mr-3 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Rating Section */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold mb-4 text-white">Your Rating</h3>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        className={`text-2xl transition-all duration-300 hover:scale-110 ${
                          star <= userRating ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">
                    {userRating > 0 ? `You rated ${userRating}/5 stars` : 'Click to rate this movie'}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Synopsis */}
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 mb-8">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Synopsis
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">{movie.description}</p>
              </div>

              {/* Movie Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Genres */}
                <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                    <Film className="w-5 h-5 text-red-500" />
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre: string) => (
                      <span 
                        key={genre} 
                        className="px-3 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm border border-red-600/30 backdrop-blur-sm hover:bg-red-600/30 transition-colors duration-300"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold mb-3 text-white">Details</h3>
                  <div className="space-y-3">
                    {movie.duration && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration</span>
                        <span className="text-white">{movie.duration}</span>
                      </div>
                    )}
                    {movie.year && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Release Year</span>
                        <span className="text-white">{movie.year}</span>
                      </div>
                    )}
                    {movie.region && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Region</span>
                        <span className="text-white">{movie.region}</span>
                      </div>
                    )}
                    {movie.translator && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Translator</span>
                        <span className="text-white">{movie.translator}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cast Section (if available) */}
              {movie.cast && movie.cast.length > 0 && (
                <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 mb-8">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Cast
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {movie.cast.slice(0, 6).map((actor: string, index: number) => (
                      <div key={index} className="text-center">
                        <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-2">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm text-white">{actor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <MovieComments 
                movieId={movie.id} 
                movieTitle={movie.title} 
                moviePoster={movie.coverImage} 
              />
            </div>
          </div>
        </div>

        {/* Netflix-style Related Movies */}
        {relatedMovies.length > 0 && (
          <div className="bg-gradient-to-b from-black to-gray-900 py-16">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  More Like This
                </h2>
                <Link href="/browse">
                  <Button variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                    View All
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {relatedMovies.map((relatedMovie) => (
                  <MovieCard key={relatedMovie.id} movie={relatedMovie} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}