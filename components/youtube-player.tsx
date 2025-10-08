"use client"

import { useState, useRef, useEffect } from "react"
import { X, Maximize, Minimize, Volume2, VolumeX } from "lucide-react"

interface YouTubePlayerProps {
  videoId: string
  onClose: () => void
  isTrailer?: boolean
}

export default function YouTubePlayer({ videoId, onClose, isTrailer = true }: YouTubePlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          onClose()
        }
      }
    }

    const handleIframeLoad = () => {
      setIsLoading(false)
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    if (iframeRef.current) {
      iframeRef.current.addEventListener("load", handleIframeLoad)
    }

    document.addEventListener("keydown", handleEscape)
    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      if (iframeRef.current) {
        iframeRef.current.removeEventListener("load", handleIframeLoad)
      }
    }
  }, [onClose])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const toggleMute = () => {
    if (iframeRef.current) {
      // This is a simplified approach - in a real implementation, you would use the YouTube Player API
      setIsMuted(!isMuted)

      // For demonstration purposes only - this doesn't actually mute the iframe
      // In a real implementation, you would use the YouTube Player API
    }
  }

  // Determine the appropriate parameters based on whether this is a trailer or full movie
  const youtubeParams = isTrailer ? `autoplay=1&rel=0` : `autoplay=1&rel=0&controls=0&showinfo=0&modestbranding=1`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div ref={containerRef} className={`relative ${isFullscreen ? "w-full h-full" : "w-full max-w-5xl mx-4"}`}>
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>

          <button
            onClick={onClose}
            className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="w-12 h-12 border-4 border-gray-600 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        )}

        <div
          className={`relative ${isFullscreen ? "h-full" : "pb-[56.25%] h-0"} overflow-hidden rounded-lg shadow-2xl`}
        >
          <iframe
            ref={iframeRef}
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?${youtubeParams}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  )
}

