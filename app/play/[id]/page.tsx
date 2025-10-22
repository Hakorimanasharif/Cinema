"use client"

import { useState, useRef, useEffect, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  Play,
  Pause,
  Download,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Rewind,
  FastForward,
  ArrowLeft,
  Film,
  ChevronLeft,
  ChevronRight,
  Home,
  Tv,
  Star,
  Clock,
  Calendar,
  Users,
  Languages,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import Footer from "@/components/footer"
import YouTubePlayer from "@/components/youtube-player"
import LoadingSpinner from "@/components/loading-spinner"
import MovieComments from "@/components/movie-comments"

interface PlayPageProps {
  params: Promise<{
    id: string
  }>
}

interface Episode {
  episodeNumber: number
  title: string
  description?: string
  duration?: string
  videoUrl?: string
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
}

export default function PlayPage({ params }: PlayPageProps) {
  const { id } = use(params)
  const [content, setContent] = useState<any>(null)
  const [isSeries, setIsSeries] = useState(false)
  const [currentSeason, setCurrentSeason] = useState(1)
  const [currentEpisode, setCurrentEpisode] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showYouTubePlayer, setShowYouTubePlayer] = useState(false)
  const [showTrailerPlayer, setShowTrailerPlayer] = useState(false)
  const [viewMode, setViewMode] = useState<'trailer' | 'player'>('player')
  const [isLoading, setIsLoading] = useState(false)
  const [isBuffering, setIsBuffering] = useState(true)
  const [userRating, setUserRating] = useState(0)
  const [hasIncremented, setHasIncremented] = useState(false)
  const [relatedMovies, setRelatedMovies] = useState<any[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const relatedCarouselRef = useRef<HTMLDivElement>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cinemax-8yem.onrender.com"

  const updateViews = async () => {
    if (hasIncremented) return
    try {
      const endpoint = isSeries ? `/api/series/${id}/views` : `/api/movies/${id}/views`
      const res = await fetch(`${API_BASE}${endpoint}`, { method: 'POST' })
      const data = await res.json()
      console.log('Views updated:', data.views)
      setContent((prev: any) => ({ ...prev, views: data.views }))
      setHasIncremented(true)
    } catch (error) {
      console.error('Failed to update views:', error)
    }
  }

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true)
      try {
        // Try to fetch as series first
        const seriesRes = await fetch(`${API_BASE}/api/series/${id}`)
        if (seriesRes.ok) {
          const seriesData = await seriesRes.json()
          setContent(seriesData)
          setIsSeries(true)

          // Get season and episode from URL params
          const urlParams = new URLSearchParams(window.location.search)
          const season = parseInt(urlParams.get("season") || "1")
          const episode = parseInt(urlParams.get("episode") || "1")
          setCurrentSeason(season)
          setCurrentEpisode(episode)
          return
        }

        // If not series, try movie
        const movieRes = await fetch(`${API_BASE}/api/movies/${id}`)
        if (movieRes.ok) {
          const movieData = await movieRes.json()
          setContent({
            id: movieData._id,
            title: movieData.title,
            description: movieData.description,
            year: movieData.year,
            duration: movieData.duration,
            rating: movieData.rating,
            coverImage: movieData.coverImage,
            trailerYouTubeId: movieData.trailerYouTubeId,
            region: movieData.region,
            translator: movieData.translator,
            videoUrl: movieData.videoUrl,
            downloadUrl: movieData.downloadUrl,
            views: movieData.views,
          })
          setIsSeries(false)
        } else {
          throw new Error("Content not found")
        }
      } catch (e: any) {
        console.error(e?.message)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchContent()
    }
  }, [id, API_BASE])

  useEffect(() => {
    if (!content) return

    // Increment views when content loads
    updateViews()

    // Set view mode
    // Always start with player mode when coming from "Watch Now"
    setViewMode('player')

    // Check if this is Fast X (ID 25) and automatically show YouTube player
    if (!isSeries && content.id === "25") {
      setShowYouTubePlayer(true)
    }

    // Removed automatic opening of external video URLs to allow them to play in the video player

    // Set up fullscreen change event listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    // Simulate video loading
    const bufferingTimeout = setTimeout(() => {
      setIsBuffering(false)
    }, 2500)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      clearTimeout(bufferingTimeout)
    }
  }, [content, isSeries])

  useEffect(() => {
    if (!content || isSeries) return

    const fetchRelated = async () => {
      try {
        const params = new URLSearchParams()
        if (content.category) params.append("category", content.category)
        params.append("limit", "10")
        const res = await fetch(`${API_BASE}/api/movies?${params.toString()}`)
        const data = await res.json()
        if (res.ok) {
          setRelatedMovies(data.filter((m: any) => m._id !== content.id))
        }
      } catch (error) {
        console.error('Failed to fetch related movies:', error)
      }
    }

    fetchRelated()
  }, [content, isSeries, API_BASE])

  const getCurrentDownloadUrl = () => {
    if (isSeries && content.seasons) {
      const season = content.seasons.find((s: Season) => s.seasonNumber === currentSeason)
      if (season) {
        const episode = season.episodes.find((e: Episode) => e.episodeNumber === currentEpisode)
        return episode?.downloadUrl
      }
    }
    return content?.downloadUrl
  }

  const getCurrentVideoUrl = () => {
    if (isSeries && content.seasons) {
      const season = content.seasons.find((s: Season) => s.seasonNumber === currentSeason)
      if (season) {
        const episode = season.episodes.find((e: Episode) => e.episodeNumber === currentEpisode)
        return episode?.videoUrl
      }
    }
    return content?.videoUrl
  }

  const getCurrentEmbedCode = () => {
    if (isSeries && content.seasons) {
      const season = content.seasons.find((s: Season) => s.seasonNumber === currentSeason)
      if (season) {
        const episode = season.episodes.find((e: Episode) => e.episodeNumber === currentEpisode)
        return episode?.embedCode
      }
    }
    return content?.embedCode
  }

  const getCurrentEpisode = () => {
    if (isSeries && content.seasons) {
      const season = content.seasons.find((s: Season) => s.seasonNumber === currentSeason)
      if (season) {
        return season.episodes.find((e: Episode) => e.episodeNumber === currentEpisode)
      }
    }
    return null
  }

  const navigateEpisode = (direction: 'prev' | 'next') => {
    if (!isSeries || !content.seasons) return

    const currentSeasonData = content.seasons.find((s: Season) => s.seasonNumber === currentSeason)
    if (!currentSeasonData) return

    let newSeason = currentSeason
    let newEpisode = currentEpisode

    if (direction === 'next') {
      if (currentEpisode < currentSeasonData.episodes.length) {
        newEpisode = currentEpisode + 1
      } else if (currentSeason < content.seasons.length) {
        newSeason = currentSeason + 1
        newEpisode = 1
      }
    } else {
      if (currentEpisode > 1) {
        newEpisode = currentEpisode - 1
      } else if (currentSeason > 1) {
        newSeason = currentSeason - 1
        const prevSeasonData = content.seasons.find((s: Season) => s.seasonNumber === newSeason)
        newEpisode = prevSeasonData?.episodes.length || 1
      }
    }

    setCurrentSeason(newSeason)
    setCurrentEpisode(newEpisode)
    setHasIncremented(false)

    // Update URL
    const newUrl = `/play/${id}?season=${newSeason}&episode=${newEpisode}`
    window.history.replaceState({}, '', newUrl)
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingSpinner size="lg" color="primary" />
      </div>
    )
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
    }
  }

  const handleProgressChange = (value: number[]) => {
    if (videoRef.current && value.length > 0) {
      const newTime = (value[0] / 100) * videoRef.current.duration
      videoRef.current.currentTime = newTime
      setProgress(value[0])
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const handleDownload = async () => {
    const downloadUrl = getCurrentDownloadUrl() || getCurrentVideoUrl()
    if (!downloadUrl) return
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
      const response = await fetch(downloadUrl)
      if (!response.ok) throw new Error('Failed to fetch file')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      const title = isSeries ? `${content.title} S${currentSeason}E${currentEpisode}` : content.title
      link.download = `${title.replace(/\s+/g, "_")}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
      // Fallback to direct link
      window.open(downloadUrl, '_blank')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && playerContainerRef.current) {
      playerContainerRef.current.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const rewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10)
    }
  }

  const fastForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10)
    }
  }

  const scrollLeft = () => {
    if (relatedCarouselRef.current) {
      relatedCarouselRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (relatedCarouselRef.current) {
      relatedCarouselRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  const handleRating = async (rating: number) => {
    if (!content) return
    try {
      const endpoint = isSeries ? `/api/series/${id}/rate` : `/api/movies/${id}/rate`
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating })
      })
      if (res.ok) {
        setUserRating(rating)
        // Optionally update the content rating
      }
    } catch (error) {
      console.error('Failed to submit rating:', error)
    }
  }

  const currentEpisodeData = getCurrentEpisode()
  const videoUrl = getCurrentVideoUrl()
  const embedCode = getCurrentEmbedCode()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <main className="bg-black pt-16">
        {/* Netflix-style Back Navigation */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href={isSeries ? `/series/${content._id}` : `/movie/${content.id}`}>
            <Button variant="ghost" size="sm" className="mb-4 hover:bg-white/10 transition-all duration-300">
              <ArrowLeft className="mr-2 h-4 w-4" /> 
              Back to {isSeries ? "series" : "movie"} details
            </Button>
          </Link>
        </div>

        {/* Netflix-style Episode Navigation for Series */}
        {isSeries && (
          <div className="max-w-7xl mx-auto px-4 mb-6">
            <div className="flex items-center justify-between bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Tv className="w-5 h-5 text-red-500" />
                  <span className="text-white font-semibold">Currently Watching:</span>
                </div>
                
                <Select value={currentSeason.toString()} onValueChange={(value) => {
                  setCurrentSeason(parseInt(value))
                  setCurrentEpisode(1)
                  const newUrl = `/play/${id}?season=${value}&episode=1`
                  window.history.replaceState({}, '', newUrl)
                }}>
                  <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 text-white">
                    {content.seasons?.map((season: Season) => (
                      <SelectItem key={season.seasonNumber} value={season.seasonNumber.toString()} className="hover:bg-gray-700">
                        Season {season.seasonNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={currentEpisode.toString()} onValueChange={(value) => {
                  setCurrentEpisode(parseInt(value))
                  const newUrl = `/play/${id}?season=${currentSeason}&episode=${value}`
                  window.history.replaceState({}, '', newUrl)
                }}>
                  <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 text-white">
                    {content.seasons?.find((s: Season) => s.seasonNumber === currentSeason)?.episodes.map((episode: Episode) => (
                      <SelectItem key={episode.episodeNumber} value={episode.episodeNumber.toString()} className="hover:bg-gray-700">
                        Episode {episode.episodeNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateEpisode('prev')}
                  disabled={currentSeason === 1 && currentEpisode === 1}
                  className="border-gray-600 text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateEpisode('next')}
                  disabled={
                    currentSeason === content.seasons?.length &&
                    currentEpisode === content.seasons?.[content.seasons.length - 1]?.episodes.length
                  }
                  className="border-gray-600 text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Netflix-style Video Player Container */}
        {showYouTubePlayer ? (
          <div className="max-w-7xl mx-auto px-4">
            <YouTubePlayer videoId="tbzb8cNfeeY" onClose={() => setShowYouTubePlayer(false)} isTrailer={false} />
          </div>
        ) : viewMode === 'trailer' && !isSeries ? (
          <div className="max-w-7xl mx-auto px-4">
            {/* Netflix-style Hero Section with Trailer */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-8 border border-gray-700/50 shadow-2xl">
              {content.trailerYouTubeId ? (
                <YouTubePlayer videoId={content.trailerYouTubeId} onClose={() => {}} isTrailer={true} />
              ) : (
                <>
                  <Image
                    src={content.coverImage || "/placeholder.svg"}
                    alt={content.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-end">
                    <div className="p-8 w-full">
                      <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-['Bebas_Neue'] tracking-tight">
                          {content.title}
                        </h1>
                        
                        {/* Movie Info Badges */}
                        <div className="flex items-center gap-4 mb-4 flex-wrap">
                          <div className="flex items-center gap-2 bg-red-600/20 px-3 py-1 rounded-full border border-red-600/30">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white text-sm font-semibold">{content.rating}/10</span>
                          </div>
                          {content.year && (
                            <div className="flex items-center gap-2 text-gray-300">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">{content.year}</span>
                            </div>
                          )}
                          {content.duration && (
                            <div className="flex items-center gap-2 text-gray-300">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{content.duration}</span>
                            </div>
                          )}
                          {content.views && (
                            <div className="flex items-center gap-2 text-gray-300">
                              <Users className="w-4 h-4" />
                              <span className="text-sm">{content.views} Views</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                          <Button
                            className="bg-red-600 hover:bg-red-700 px-8 py-6 text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg shadow-red-600/25"
                            onClick={() => {
                              const videoUrl = getCurrentVideoUrl()
                              if (videoUrl && (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) && !videoUrl.includes(window.location.hostname)) {
                                window.open(videoUrl, '_blank')
                              } else {
                                setViewMode('player')
                              }
                            }}
                          >
                            <Play className="mr-3 h-5 w-5 fill-white" />
                            Watch Full Movie
                          </Button>
                          <Button
                            className="bg-transparent hover:bg-white/10 border-2 border-white/30 text-white px-8 py-6 text-lg font-semibold backdrop-blur-sm hover:border-white/50 transform hover:scale-105 transition-all duration-300"
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
                                <Download className="mr-3 h-5 w-5" />
                                Download Movie
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Additional Movie Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
                <p className="text-gray-300 leading-relaxed">{content.description}</p>
                
                {/* Movie Details */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {content.region && (
                    <div>
                      <h4 className="text-sm text-gray-400 mb-1">Region</h4>
                      <p className="text-white">{content.region}</p>
                    </div>
                  )}
                  {content.translator && (
                    <div>
                      <h4 className="text-sm text-gray-400 mb-1">Translator</h4>
                      <div className="flex items-center gap-2 text-white">
                        <Languages className="w-4 h-4" />
                        {content.translator}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Quick Actions Sidebar */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 h-fit">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-gray-600 text-white hover:bg-red-600 hover:border-red-600"
                    onClick={() => setShowTrailerPlayer(true)}
                  >
                    <Film className="mr-3 h-4 w-4" />
                    Watch Trailer
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-gray-600 text-white hover:bg-red-600 hover:border-red-600"
                    onClick={handleDownload}
                    disabled={isLoading}
                  >
                    <Download className="mr-3 h-4 w-4" />
                    {isLoading ? 'Downloading...' : 'Download Movie'}
                  </Button>
                  <Link href="/" className="block">
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-white hover:bg-red-600 hover:border-red-600">
                      <Home className="mr-3 h-4 w-4" />
                      Browse More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : embedCode ? (
          <div className="max-w-7xl mx-auto px-4">
            <div className="aspect-video bg-black rounded-xl overflow-hidden border border-gray-700/50">
              <div dangerouslySetInnerHTML={{ __html: embedCode }} />
            </div>
          </div>
        ) : (
          <div
            ref={playerContainerRef}
            className={`relative mx-auto ${isFullscreen ? "w-full" : "max-w-7xl px-4"}`}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                <div className="text-center">
                  <LoadingSpinner size="lg" color="primary" />
                  <p className="text-white mt-4">Loading content...</p>
                </div>
              </div>
            )}
            <video
              ref={videoRef}
              className="w-full aspect-video bg-black rounded-xl"
              poster={content.coverImage}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              controls={false}
              onCanPlay={() => setIsBuffering(false)}
              onWaiting={() => setIsBuffering(true)}
              onLoadedData={() => setIsBuffering(false)}
            >
              <source
                src={videoUrl}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            {/* Netflix-style Video Controls */}
            <div
              className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="px-6 pb-1">
                <Slider
                  value={[progress]}
                  min={0}
                  max={100}
                  step={0.1}
                  onValueChange={handleProgressChange}
                  className="w-full [&>span:first-child]:h-1.5 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-red-600 [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-red-600 [&_[role=slider]:focus-visible]:ring-2 [&_[role=slider]:focus-visible]:ring-red-400 [&_[role=slider]:focus-visible]:ring-offset-2 [&_[role=slider]:focus-visible]:scale-110 [&_[role=slider]:focus-visible]:transition-transform"
                />
              </div>
              <div className="flex items-center gap-4 p-6 pt-2 text-white">
                <Button size="icon" variant="ghost" className="w-12 h-12 hover:bg-white/20 transition-all duration-300" onClick={togglePlay}>
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white" />}
                </Button>
                <Button size="icon" variant="ghost" className="w-10 h-10 hover:bg-white/20 transition-all duration-300" onClick={rewind}>
                  <Rewind className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="w-10 h-10 hover:bg-white/20 transition-all duration-300" onClick={fastForward}>
                  <FastForward className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="w-10 h-10 hover:bg-white/20 transition-all duration-300" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <div className="text-sm font-medium bg-black/30 px-3 py-1 rounded">
                  {videoRef.current ? formatTime(videoRef.current.currentTime) : "0:00"} /{" "}
                  {videoRef.current ? formatTime(videoRef.current.duration || 0) : "0:00"}
                </div>
                
                <div className="flex-1" />
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/20 transition-all duration-300"
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
                      <Download className="w-4 h-4 mr-2" /> Download
                    </>
                  )}
                </Button>
                <Button size="icon" variant="ghost" className="w-10 h-10 hover:bg-white/20 transition-all duration-300" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Content Info for Player View */}
        {viewMode === 'player' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {content.title}
                {isSeries && currentEpisodeData && ` - S${currentSeason}E${currentEpisode}: ${currentEpisodeData.title}`}
              </h1>
              
              <div className="flex items-center gap-6 text-gray-300 mb-6 flex-wrap">
                {content.year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{content.year}</span>
                  </div>
                )}
                {isSeries ? (
                  currentEpisodeData?.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{currentEpisodeData.duration}</span>
                    </div>
                  )
                ) : (
                  content.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{content.duration}</span>
                    </div>
                  )
                )}
                {content.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{content.rating}/10</span>
                  </div>
                )}
                {content.region && (
                  <div className="flex items-center gap-2">
                    <span>🌍 {content.region}</span>
                  </div>
                )}
                {content.translator && (
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    <span>{content.translator}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{content.views || 0} Views</span>
                </div>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed">
                {isSeries && currentEpisodeData?.description ? currentEpisodeData.description : content.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-6">
                {content.trailerYouTubeId && (
                  <Button
                    variant="outline"
                    onClick={() => setShowTrailerPlayer(true)}
                    className="border-gray-600 text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300"
                  >
                    <Film className="mr-2 h-4 w-4" /> Watch Trailer
                  </Button>
                )}

                <Button 
                  variant="outline" 
                  onClick={handleDownload} 
                  disabled={isLoading}
                  className="border-gray-600 text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="white" className="mr-2" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Download
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        {!isSeries && <MovieComments movieId={content.id} movieTitle={content.title} />}

        {/* Netflix-style Related Movies Carousel */}
        {!isSeries && relatedMovies.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                More Like This
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={scrollLeft}
                  className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-white transition-all duration-300 hover:scale-110"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={scrollRight}
                  className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full text-white transition-all duration-300 hover:scale-110"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div
              ref={relatedCarouselRef}
              className="flex overflow-x-auto space-x-6 pb-6 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {relatedMovies.map((movie) => (
                <Link key={movie._id} href={`/movie/${movie._id}`} className="flex-shrink-0 w-48 group">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-lg transition-all duration-500 group-hover:scale-105">
                    <Image 
                      src={movie.coverImage || "/placeholder.svg"} 
                      alt={movie.title} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-semibold text-sm truncate">{movie.title}</h3>
                      <p className="text-gray-300 text-xs">{movie.year}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}