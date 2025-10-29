"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Star, Calendar, Eye, Clock, ArrowLeft, ChevronLeft, ChevronRight, Film } from "lucide-react"
import TrailerButton from "@/components/trailer-button"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface Episode {
  episodeNumber: number
  title: string
  description?: string
  duration?: string
  videoUrl?: string
  views?: number
  thumbnail?: string
}

interface Season {
  seasonNumber: number
  episodes: Episode[]
  poster?: string
  year?: number
  rating?: number
}

interface Series {
  _id: string
  title: string
  description?: string
  year?: number
  rating?: string | number
  coverImage?: string
  trailerYouTubeId?: string
  category?: string
  region?: string
  translator?: string
  seasons?: Season[]
  views?: number
  totalEpisodes?: number
}

export default function SeriesDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [series, setSeries] = useState<Series | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSeason, setSelectedSeason] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState(1)
  const episodesPerPage = 10

  useEffect(() => {
    const fetchSeries = async () => {
      if (!params.id) return

      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`https://cinemax-8yem.onrender.com/api/series/${params.id}`)
        const data = await res.json()
        if (res.ok) {
          setSeries(data)
        } else {
          setError(data?.error || "Failed to load series")
        }
      } catch (err) {
        setError("Failed to load series")
      } finally {
        setLoading(false)
      }
    }

    fetchSeries()
  }, [params.id])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedSeason])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <div className="absolute inset-0 border-2 border-blue-200 rounded-full animate-ping"></div>
          </div>
          <p className="text-white text-lg font-medium">Loading series...</p>
        </div>
      </div>
    )
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Film className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Series Not Found</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <Button
              onClick={() => router.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentSeason = series.seasons?.find(season => season.seasonNumber === selectedSeason)
  const episodes = currentSeason?.episodes || []
  const totalPages = Math.ceil(episodes.length / episodesPerPage)
  const startIndex = (currentPage - 1) * episodesPerPage
  const endIndex = startIndex + episodesPerPage
  const currentEpisodes = episodes.slice(startIndex, endIndex)

  const totalEpisodes = series.seasons?.reduce((total, season) => total + season.episodes.length, 0) || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Header />

      {/* Simplified Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Poster */}
            <div className="w-48 md:w-64 flex-shrink-0">
              <Image
                src={series.coverImage || "/placeholder.svg"}
                alt={series.title}
                width={256}
                height={384}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{series.title}</h1>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-4">
                {series.year && (
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                    <Calendar className="w-4 h-4 mr-1" />
                    {series.year}
                  </Badge>
                )}
                {series.rating && (
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400" />
                    {String(series.rating)}
                  </Badge>
                )}
                {series.category && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                    {series.category}
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-gray-500/20 text-gray-300">
                  {totalEpisodes} Episodes
                </Badge>
              </div>

              <p className="text-gray-300 text-lg mb-6 max-w-2xl">{series.description}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {episodes.length > 0 && (
                  <Link href={`/play/${series._id}?season=${selectedSeason}&episode=1`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                      <Play className="w-5 h-5 mr-2" />
                      Watch Now
                    </Button>
                  </Link>
                )}
                {series.trailerYouTubeId && (
                  <TrailerButton
                    videoId={series.trailerYouTubeId}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Season Navigation */}
        {series.seasons && series.seasons.length > 1 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Seasons</h2>
            <div className="flex gap-2 overflow-x-auto pb-4">
              {series.seasons.map((season) => (
                <button
                  key={season.seasonNumber}
                  onClick={() => setSelectedSeason(season.seasonNumber)}
                  className={`flex-shrink-0 px-6 py-3 rounded-lg border-2 transition-all ${
                    selectedSeason === season.seasonNumber
                      ? 'border-blue-500 bg-blue-500/20 text-white'
                      : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  Season {season.seasonNumber}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Episodes Grid */}
        {episodes.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Season {selectedSeason} Episodes
              </h2>
              <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                {episodes.length} episodes
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {currentEpisodes.map((episode) => (
                <div key={episode.episodeNumber} className="group/card flex-none">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-gray-300/20 bg-gray-900/50 transition-all duration-500 ease-out group-hover/card:scale-105 group-hover/card:shadow-2xl group-hover/card:shadow-red-500/20">
                    {/* Main Image */}
                    <Image
                      src={episode.thumbnail || series.coverImage || "/placeholder.svg"}
                      alt={episode.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-500" />

                    {/* Top Section - Episode Number */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-100">
                      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                        <Badge className="bg-black/80 text-white border-0 text-xs">
                          E{episode.episodeNumber}
                        </Badge>
                      </div>
                    </div>

                    {/* Center Section - Play Button */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-150 space-y-4">
                      {/* Play Button */}
                      {episode.videoUrl ? (
                        <a href={episode.videoUrl} target="_blank" rel="noopener noreferrer">
                          <Button
                            size="icon"
                            className="rounded-full bg-red-600 hover:bg-red-700 shadow-2xl w-16 h-16 transition-all duration-300 hover:scale-110 border-2 border-white/20"
                          >
                            <Play className="h-7 w-7 fill-white ml-1" />
                          </Button>
                        </a>
                      ) : (
                        <Link href={`/play/${series._id}?season=${selectedSeason}&episode=${episode.episodeNumber}`}>
                          <Button
                            size="icon"
                            className="rounded-full bg-red-600 hover:bg-red-700 shadow-2xl w-16 h-16 transition-all duration-300 hover:scale-110 border-2 border-white/20"
                          >
                            <Play className="h-7 w-7 fill-white ml-1" />
                          </Button>
                        </Link>
                      )}
                    </div>

                    {/* Bottom Section - Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-6 group-hover/card:translate-y-0 transition-transform duration-500">
                      {/* Episode Info */}
                      <div className="text-center space-y-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-300">
                        <h3 className="text-white font-bold text-sm line-clamp-1 drop-shadow-lg">{episode.title}</h3>
                        <div className="flex items-center justify-center gap-3 text-xs text-gray-200">
                          {episode.duration && (
                            <span>{episode.duration}</span>
                          )}
                          {episode.views && (
                            <>
                              {episode.duration && <span className="w-1 h-1 bg-gray-400 rounded-full"></span>}
                              <span>{episode.views.toLocaleString()} views</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-1000" />
                  </div>

                  {/* Default Visible Info (when not hovering) */}
                  <div className="mt-3 space-y-1 group-hover/card:opacity-0 transition-opacity duration-300">
                    <h3 className="text-sm font-semibold text-white truncate">{episode.title}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">Episode {episode.episodeNumber}</p>
                      {episode.views && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">{episode.views.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "border-gray-600 text-gray-300 hover:bg-gray-700"
                      }
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-12 text-center">
              <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No episodes available</h3>
              <p className="text-gray-400">This season doesn't have any episodes yet.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  )
}
