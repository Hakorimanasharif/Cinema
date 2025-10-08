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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Header from "@/components/header"
import Footer from "@/components/footer"

import YouTubePlayer from "@/components/youtube-player"
import LoadingSpinner from "@/components/loading-spinner"

interface PlayPageProps {
  params: Promise<{
    id: string
  }>
}

export default function PlayPage({ params }: PlayPageProps) {
  const { id } = use(params)
  const [movie, setMovie] = useState<any>(null)
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

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true)
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
          trailerYouTubeId: data.trailerYouTubeId,
          region: data.region,
          translator: data.translator,
          videoUrl: data.videoUrl,
        })
      } catch (e: any) {
        console.error(e?.message)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }
    
    if (id) {
      fetchMovie()
    }
  }, [id, API_BASE])

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingSpinner size="lg" color="primary" />
      </div>
    )
  }

  useEffect(() => {
    if (!movie) return

    // Check if this is Fast X (ID 25) and automatically show YouTube player
    if (movie.id === "25") {
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
  }, [movie])

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
    setIsLoading(true)

    // Simulate download delay
    setTimeout(() => {
      // For Fast X, provide a direct download link to the YouTube video
      if (movie.id === "25") {
        // In a real app, you would implement server-side YouTube video downloading
        // This is just a placeholder that would download the sample video
        const link = document.createElement("a")
        link.href = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        link.download = `${movie.title.replace(/\s+/g, "_")}.mp4`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // For other movies, download the sample video
        const link = document.createElement("a")
        link.href = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        link.download = `${movie.title.replace(/\s+/g, "_")}.mp4`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <main className="bg-black pt-16">
        {/* Back button */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href={`/movie/${movie.id}`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to movie details
            </Button>
          </Link>
        </div>

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
              poster={movie.coverImage}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              controls={false}
              onCanPlay={() => setIsBuffering(false)}
              onWaiting={() => setIsBuffering(true)}
              onLoadedData={() => setIsBuffering(false)}
            >
              <source
                src={movie.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
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
                <Link href={`/download/${movie.id}`} className="ml-2">
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

        {/* Movie Info */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
            <span>{movie.year}</span>
            <span>{movie.duration}</span>
            <span>{movie.rating}</span>
            {movie.region && <span>Region: {movie.region}</span>}
            {movie.translator && <span>Translator: {movie.translator}</span>}
          </div>
          <p className="text-gray-300">{movie.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {!showYouTubePlayer && movie.id === "25" && (
              <Button className="bg-red-600 hover:bg-red-700" onClick={() => setShowYouTubePlayer(true)}>
                <Play className="mr-2 h-4 w-4" /> Watch Full Movie
              </Button>
            )}

            {movie.trailerYouTubeId && (
              <Button
                variant="outline"
                onClick={() => window.open(`https://www.youtube.com/watch?v=${movie.trailerYouTubeId}`, "_blank")}
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
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}