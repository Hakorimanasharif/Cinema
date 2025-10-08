"use client"

import { useState } from "react"
import { Film, Maximize, Minimize } from "lucide-react"

interface TrailerButtonProps {
  videoId: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export default function TrailerButton({
  videoId,
  variant = "outline",
  size = "sm",
  className = "",
}: TrailerButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    const iframe = document.getElementById("trailer-iframe")
    if (!iframe) return
    if (!document.fullscreenElement) {
      iframe.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 ${className}`}>
        <Film className="mr-2 h-4 w-4" /> Trailer
      </button>

      {isHovered && (
        <div className="absolute top-full left-0 mt-2 w-80 h-48 bg-black rounded-lg overflow-hidden shadow-lg z-50">
          <iframe
            id="trailer-iframe"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full"
          />
          <button
            onClick={toggleFullscreen}
            className="absolute top-2 right-2 bg-black bg-opacity-50 rounded p-1 text-white"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      )}
    </div>
  )
}
