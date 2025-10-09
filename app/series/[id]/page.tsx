"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Play, Star, Calendar, Eye, Clock, ArrowLeft } from "lucide-react"

interface Episode {
  episodeNumber: number
  title: string
  description?: string
  duration?: string
  videoUrl?: string
  views?: number
}

interface Season {
  seasonNumber: number
  episodes: Episode[]
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
}

export default function SeriesDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [series, setSeries] = useState<Series | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !series) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Series Not Found</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <Image
          src={series.coverImage || "/placeholder.svg"}
          alt={series.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="w-48 md:w-64 flex-shrink-0">
                <Image
                  src={series.coverImage || "/placeholder.svg"}
                  alt={series.title}
                  width={256}
                  height={384}
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              </div>
              <div className="flex-1 text-white">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">{series.title}</h1>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  {series.year && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{series.year}</span>
                    </div>
                  )}
                  {series.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>{String(series.rating)}</span>
                    </div>
                  )}
                  {series.category && (
                    <Badge variant="secondary">{series.category}</Badge>
                  )}
                  {series.views && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{series.views} views</span>
                    </div>
                  )}
                </div>

                <p className="text-lg text-gray-200 mb-6 line-clamp-3">{series.description}</p>

                <div className="flex gap-3">
                  {series.seasons && series.seasons.length > 0 && series.seasons[0].episodes.length > 0 && (
                    <Link href={`/play/${series._id}?season=1&episode=1`}>
                      <Button size="lg" className="gap-2">
                        <Play className="w-5 h-5" />
                        Play Episode 1
                      </Button>
                    </Link>
                  )}
                  {series.trailerYouTubeId && (
                    <Button size="lg" variant="outline" className="gap-2">
                      <Play className="w-5 h-5" />
                      Watch Trailer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Seasons and Episodes */}
        {series.seasons && series.seasons.length > 0 ? (
          <div className="space-y-8">
            {series.seasons.map((season) => (
              <Card key={season.seasonNumber} className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl">Season {season.seasonNumber}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {season.episodes.map((episode) => (
                      <div key={episode.episodeNumber} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                          <span className="font-semibold text-sm">{episode.episodeNumber}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground mb-1">{episode.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{episode.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            {episode.duration && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {episode.duration}
                              </div>
                            )}
                            {episode.views && (
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {episode.views} views
                              </div>
                            )}
                          </div>
                        </div>

                        <Link href={`/play/${series._id}?season=${season.seasonNumber}&episode=${episode.episodeNumber}`}>
                          <Button size="sm" className="gap-2">
                            <Play className="w-4 h-4" />
                            Play
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-medium text-foreground mb-2">No episodes available</h3>
              <p className="text-muted-foreground">This series doesn't have any episodes yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
