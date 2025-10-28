"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Play, Star, Calendar, Eye, Clock, ArrowLeft, Users, Film, SeasonIcon, Heart, Share2 } from "lucide-react"
import TrailerButton from "@/components/trailer-button"

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

  const totalEpisodes = series.seasons?.reduce((total, season) => total + season.episodes.length, 0) || 0
  const totalSeasons = series.seasons?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="relative h-80 md:h-[500px] lg:h-[600px] overflow-hidden">
        <Image
          src={series.coverImage || "/placeholder.svg"}
          alt={series.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start md:items-end">
              {/* Series Poster */}
              <div className="w-32 md:w-48 lg:w-64 flex-shrink-0 transform -translate-y-8 md:translate-y-0">
                <div className="relative group">
                  <Image
                    src={series.coverImage || "/placeholder.svg"}
                    alt={series.title}
                    width={256}
                    height={384}
                    className="w-full h-auto rounded-xl shadow-2xl transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Series Info */}
              <div className="flex-1 text-white space-y-4 md:space-y-6">
                <div>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 leading-tight">
                    {series.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    {series.year && (
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        <Calendar className="w-3 h-3 mr-1" />
                        {series.year}
                      </Badge>
                    )}
                    {series.rating && (
                      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400" />
                        {String(series.rating)}
                      </Badge>
                    )}
                    {series.category && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                        {series.category}
                      </Badge>
                    )}
                    {totalSeasons > 0 && (
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        <SeasonIcon className="w-3 h-3 mr-1" />
                        {totalSeasons} Season{totalSeasons > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>

                  {series.views && (
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{series.views.toLocaleString()} views</span>
                    </div>
                  )}
                </div>

                <p className="text-base md:text-lg text-gray-200 leading-relaxed max-w-3xl">
                  {series.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  {series.seasons && series.seasons.length > 0 && series.seasons[0].episodes.length > 0 && (
                    <Link href={`/play/${series._id}?season=1&episode=1`}>
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white gap-3 px-6 py-3 h-auto">
                        <Play className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-semibold">Play Episode 1</div>
                          <div className="text-xs opacity-90">Start watching now</div>
                        </div>
                      </Button>
                    </Link>
                  )}
                  {series.trailerYouTubeId && (
                    <TrailerButton
                      videoId={series.trailerYouTubeId}
                      className="bg-transparent border-gray-400 text-white hover:bg-white/10 gap-3 px-6 py-3 h-auto"
                      isTrailer={true}
                    >
                      <Play className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-semibold">Watch Trailer</div>
                        <div className="text-xs opacity-90">Preview the series</div>
                      </div>
                    </TrailerButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Season Navigation */}
        {series.seasons && series.seasons.length > 1 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Seasons</h2>
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
              {series.seasons.map((season) => (
                <button
                  key={season.seasonNumber}
                  onClick={() => setSelectedSeason(season.seasonNumber)}
                  className={`flex-shrink-0 px-6 py-3 rounded-xl border-2 transition-all ${
                    selectedSeason === season.seasonNumber
                      ? 'border-blue-500 bg-blue-500/20 text-white'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold">Season {season.seasonNumber}</div>
                    <div className="text-sm opacity-75">{season.episodes.length} episodes</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Season Cards Grid */}
        {series.seasons && series.seasons.length > 0 ? (
          <div className="space-y-8">
            {/* Grid View for Seasons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {series.seasons.map((season) => (
                <Card
                  key={season.seasonNumber}
                  className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 group cursor-pointer"
                  onClick={() => setSelectedSeason(season.seasonNumber)}
                >
                  <CardContent className="p-0 overflow-hidden">
                    {/* Season Poster */}
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <Image
                        src={season.poster || series.coverImage || "/placeholder.svg"}
                        alt={`${series.title} - Season ${season.seasonNumber}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

                      {/* Overlay Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <div className="flex justify-between items-center mb-2">
                          <Badge className="bg-blue-600/90 text-white border-0">
                            Season {season.seasonNumber}
                          </Badge>
                          {season.rating && (
                            <div className="flex items-center gap-1 bg-black/50 rounded-full px-2 py-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium">{season.rating}</span>
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm line-clamp-2">
                          {series.title} - Season {season.seasonNumber}
                        </h3>
                      </div>

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/50 rounded-full p-4">
                          <Play className="w-8 h-8 text-white fill-white" />
                        </div>
                      </div>
                    </div>

                    {/* Episode Count */}
                    <div className="p-4">
                      <div className="flex justify-between items-center text-sm text-gray-300">
                        <span>{season.episodes.length} episodes</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {season.episodes[0]?.duration || 'Various'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Episodes List for Selected Season */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Season {selectedSeason} Episodes
                </h2>
                <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                  {series.seasons.find(s => s.seasonNumber === selectedSeason)?.episodes.length || 0} episodes
                </Badge>
              </div>

              <div className="grid gap-4">
                {series.seasons
                  .find(season => season.seasonNumber === selectedSeason)
                  ?.episodes.map((episode) => (
                    <div
                      key={episode.episodeNumber}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-800/30 border border-gray-700 rounded-xl hover:bg-gray-700/50 transition-all group"
                    >
                      {/* Episode Thumbnail */}
                      <div className="relative w-full sm:w-40 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={episode.thumbnail || series.coverImage || "/placeholder.svg"}
                          alt={episode.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-black/80 text-white border-0 text-xs">
                            E{episode.episodeNumber}
                          </Badge>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-8 h-8 text-white fill-white" />
                        </div>
                      </div>

                      {/* Episode Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-white text-lg group-hover:text-blue-300 transition-colors">
                            {episode.title}
                          </h4>
                          <Link
                            href={`/play/${series._id}?season=${selectedSeason}&episode=${episode.episodeNumber}`}
                            className="flex-shrink-0"
                          >
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                              <Play className="w-4 h-4" />
                              Play
                            </Button>
                          </Link>
                        </div>

                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                          {episode.description || `Episode ${episode.episodeNumber} of ${series.title}`}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          {episode.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {episode.duration}
                            </div>
                          )}
                          {episode.views && (
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {episode.views.toLocaleString()} views
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Film className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No episodes available</h3>
              <p className="text-gray-400">This series doesn't have any episodes yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
