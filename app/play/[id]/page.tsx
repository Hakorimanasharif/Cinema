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
  const [viewMode, setViewMode] = useState<'trailer' | 'player'>('trailer')
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
    if (!isSeries) {
      setViewMode('trailer')
    } else {
      setViewMode('player')
    }

    // Check if this is Fast X (ID 25) and automatically show YouTube player
    if (!isSeries && content.id === "25") {
      setShowYouTubePlayer(true)
    }

    // Check if video URL is an external link and open it directly
    const videoUrl = getCurrentVideoUrl()
    if (videoUrl && (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) && !videoUrl.includes(window.location.hostname)) {
      window.open(videoUrl, '_blank')
      // Redirect back to movie page
      window.location.href = isSeries ? `/series/${content._id}` : `/movie/${content.id}`
      return
    }

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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <main className="bg-black pt-16">
        {/* Back button */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href={isSeries ? `/series/${content._id}` : `/movie/${content.id}`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to {isSeries ? "series" : "movie"} details
            </Button>
          </Link>
        </div>

        {/* Episode Navigation for Series */}
        {isSeries && (
          <div className="max-w-7xl mx-auto px-4 mb-4">
            <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <Select value={currentSeason.toString()} onValueChange={(value) => {
                  setCurrentSeason(parseInt(value))
                  setCurrentEpisode(1)
                  const newUrl = `/play/${id}?season=${value}&episode=1`
                  window.history.replaceState({}, '', newUrl)
                }}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {content.seasons?.map((season: Season) => (
                      <SelectItem key={season.seasonNumber} value={season.seasonNumber.toString()}>
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
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {content.seasons?.find((s: Season) => s.seasonNumber === currentSeason)?.episodes.map((episode: Episode) => (
                      <SelectItem key={episode.episodeNumber} value={episode.episodeNumber.toString()}>
                        Episode {episode.episodeNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateEpisode('prev')}
                  disabled={currentSeason === 1 && currentEpisode === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateEpisode('next')}
                  disabled={
                    currentSeason === content.seasons?.length &&
                    currentEpisode === content.seasons?.[content.seasons.length - 1]?.episodes.length
                  }
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Video Player */}
        {showYouTubePlayer ? (
          <div className="max-w-7xl mx-auto px-4">
            <YouTubePlayer videoId="tbzb8cNfeeY" onClose={() => setShowYouTubePlayer(false)} isTrailer={false} />
          </div>
        ) : viewMode === 'trailer' && !isSeries ? (
          <div className="max-w-7xl mx-auto px-4">
            {/* Large Trailer */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
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
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <p className="text-white text-xl text-center">No Trailer Available</p>
                  </div>
                </>
              )}
            </div>

            {/* Hero Section */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{content.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{content.year}</span>
                {content.duration && <span>{content.duration}</span>}
                {content.rating && <span>{content.rating}</span>}
                {content.region && <span>{content.region}</span>}
                {content.translator && <span>{content.translator}</span>}
                <span>{content.views || 0} Views</span>
              </div>
              {content.description && <p className="text-gray-300">{content.description}</p>}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 py-4 text-lg font-semibold"
                onClick={() => setViewMode('player')}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Full Movie
              </Button>
              <Button
                className="flex-1 py-4 text-lg"
                variant="outline"
                onClick={handleDownload}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" color="primary" className="mr-2" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Download Movie
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div
            ref={playerContainerRef}
            className={`relative mx-auto ${isFullscreen ? "w-full" : "max-w-7xl"}`}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            

            <video
              ref={videoRef}
              className="w-full aspect-video bg-black"
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

            {/* Video Controls */}
            <div
              className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="px-4 pb-1">
                <Slider
                  value={[progress]}
                  min={0}
                  max={100}
                  step={0.1}
                  onValueChange={handleProgressChange}
                  className="w-full [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-red-600 [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-red-600 [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:transition-transform"
                />
              </div>
              <div className="flex items-center gap-3 p-4 pt-0 text-white [&_svg]:text-white">
                <Button size="icon" variant="ghost" className="w-9 h-9 hover:bg-black/50" onClick={togglePlay}>
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white" />}
                </Button>
                <Button size="icon" variant="ghost" className="w-9 h-9 hover:bg-black/50" onClick={rewind}>
                  <Rewind className="w-6 h-6" />
                </Button>
                <Button size="icon" variant="ghost" className="w-9 h-9 hover:bg-black/50" onClick={fastForward}>
                  <FastForward className="w-6 h-6" />
                </Button>
                <Button size="icon" variant="ghost" className="w-9 h-9 hover:bg-black/50" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </Button>
                <div className="text-sm">
                  {videoRef.current ? formatTime(videoRef.current.currentTime) : "0:00"} /{" "}
                  {videoRef.current ? formatTime(videoRef.current.duration || 0) : "0:00"}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-black/50 ml-auto"
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
                      <Download className="w-5 h-5 mr-2" /> Download
                    </>
                  )}
                </Button>
                <Link href={`/download/${content.id}`} className="ml-2">
                  <Button variant="ghost" size="sm" className="hover:bg-black/50">
                    <Download className="w-5 h-5 mr-2" /> Download Options
                  </Button>
                </Link>
                <Button size="icon" variant="ghost" className="w-9 h-9 hover:bg-black/50" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Trailer Player */}
        {showTrailerPlayer && (
          <div className="max-w-7xl mx-auto px-4">
            <YouTubePlayer videoId={content.trailerYouTubeId} onClose={() => setShowTrailerPlayer(false)} isTrailer={true} />
          </div>
        )}

        {/* Content Info for Player View */}
        {viewMode === 'player' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">
              {content.title}
              {isSeries && currentEpisodeData && ` - S${currentSeason}E${currentEpisode}: ${currentEpisodeData.title}`}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
              <span>{content.year}</span>
              {isSeries ? (
                currentEpisodeData?.duration && <span>{currentEpisodeData.duration}</span>
              ) : (
                content.duration && <span>{content.duration}</span>
              )}
              {content.rating && <span>{content.rating}</span>}
              {content.region && <span>Region: {content.region}</span>}
              {content.translator && <span>Translator: {content.translator}</span>}
              <span>{content.views || 0} Views</span>
            </div>
            <p className="text-gray-300">
              {isSeries && currentEpisodeData?.description ? currentEpisodeData.description : content.description}
            </p>

            {/* Rating Section */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Rate this {isSeries ? 'episode' : 'movie'}</h4>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`text-2xl ${star <= userRating ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-400 transition-colors`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-400">
                  {userRating > 0 ? `You rated: ${userRating}/5` : 'Click to rate'}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {content.trailerYouTubeId && (
                <Button
                  variant="outline"
                  onClick={() => setShowTrailerPlayer(true)}
                >
                  <Film className="mr-2 h-4 w-4" /> Trailer
                </Button>
              )}

              <Button variant="outline" onClick={handleDownload} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" color="primary" className="mr-2" />
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
        )}

        {/* Comments Section */}
        {!isSeries && <MovieComments movieId={content.id} movieTitle={content.title} />}

        {/* Related Movies */}
        {!isSeries && relatedMovies.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Related Movies</h2>
            <div className="relative">
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} />
              </button>
              <div
                ref={relatedCarouselRef}
                className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {relatedMovies.map((movie) => (
                  <Link key={movie._id} href={`/movie/${movie._id}`}>
                    <div className="flex-shrink-0 w-40">
                      <div className="group">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105">
                          <Image src={movie.coverImage || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                        </div>
                        <h3 className="mt-2 text-sm font-medium truncate">{movie.title}</h3>
                        <p className="text-xs text-gray-400">{movie.year}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
