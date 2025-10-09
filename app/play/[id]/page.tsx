"use client"

import { useState, useRef, useEffect, use } from "react"
import Link from "next/link"
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
  const [isLoading, setIsLoading] = useState(false)
  const [isBuffering, setIsBuffering] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cinemax-8yem.onrender.com"

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

    // Check if this is Fast X (ID 25) and automatically show YouTube player
    if (!isSeries && content.id === "25") {
      setShowYouTubePlayer(true)
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

  const handleDownload = () => {
    const videoUrl = getCurrentVideoUrl()
    if (!videoUrl) return
    setIsLoading(true)

    // Simulate download delay
    setTimeout(() => {
      const link = document.createElement("a")
      link.href = videoUrl
      const title = isSeries ? `${content.title} S${currentSeason}E${currentEpisode}` : content.title
      link.download = `${title.replace(/\s+/g, "_")}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsLoading(false)
    }, 2000)
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
        ) : (
          <div
            ref={playerContainerRef}
            className={`relative mx-auto ${isFullscreen ? "w-full" : "max-w-7xl"}`}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            {isBuffering && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
                <div className="text-center">
                  <LoadingSpinner size="lg" color="primary" />
                  <p className="mt-4 text-lg">Buffering...</p>
                </div>
              </div>
            )}

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

        {/* Content Info */}
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
          </div>
          <p className="text-gray-300">
            {isSeries && currentEpisodeData?.description ? currentEpisodeData.description : content.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {!showYouTubePlayer && !isSeries && content.id === "25" && (
              <Button className="bg-red-600 hover:bg-red-700" onClick={() => setShowYouTubePlayer(true)}>
                <Play className="mr-2 h-4 w-4" /> Watch Full Movie
              </Button>
            )}

            {content.trailerYouTubeId && (
              <Button
                variant="outline"
                onClick={() => window.open(`https://www.youtube.com/watch?v=${content.trailerYouTubeId}`, "_blank")}
              >
                <Film className="mr-2 h-4 w-4" /> Watch on YouTube
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

        {/* Comments Section */}
        {!isSeries && <MovieComments movieId={content.id} movieTitle={content.title} />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
