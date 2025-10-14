"use client"

import { useState } from "react"
import { Film, Play, X, Volume2, VolumeX, Maximize, Minimize } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TrailerButtonProps {
  videoId: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  isTrailer?: boolean
}

const extractVideoId = (urlOrId: string): string => {
  if (!urlOrId) return ''
  
  // If it's already an ID (11 characters, typical YouTube ID length)
  if (urlOrId.length === 11) return urlOrId
  
  // Extract from watch?v= URL
  const watchMatch = urlOrId.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  if (watchMatch) return watchMatch[1]
  
  // Extract from embed URL
  const embedMatch = urlOrId.match(/youtube\.com\/embed\/([^&\n?#]+)/)
  if (embedMatch) return embedMatch[1]
  
  return ''
}

export default function TrailerButton({
  videoId: rawVideoId,
  variant = "outline",
  size = "sm",
  className = "",
  isTrailer = true,
}: TrailerButtonProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoId = extractVideoId(rawVideoId)

  const getButtonClass = () => {
    const baseClass = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variantClass = {
      default: "bg-red-600 text-white hover:bg-red-700 hover:scale-105 border border-red-600 shadow-lg shadow-red-600/25",
      outline: "border-2 border-red-500/80 text-red-500 bg-transparent hover:bg-red-500/10 hover:border-red-500 hover:scale-105 hover:shadow-lg backdrop-blur-sm",
      ghost: "text-red-500 bg-transparent hover:bg-red-500/10 hover:scale-105"
    }[variant]

    const sizeClass = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3 py-2",
      lg: "h-11 px-8 py-4 text-base",
      icon: "h-10 w-10"
    }[size]

    return `${baseClass} ${variantClass} ${sizeClass} ${className} group`
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const getYouTubeUrl = () => {
    const baseUrl = `https://www.youtube.com/embed/${videoId}`
    const params = new URLSearchParams({
      autoplay: '1',
      mute: isMuted ? '1' : '0',
      rel: '0',
      modestbranding: '1',
      showinfo: '0',
      controls: '1',
      enablejsapi: '1',
      playsinline: '1',
      iv_load_policy: '3',
      fs: '1'
    })
    return `${baseUrl}?${params.toString()}`
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={getButtonClass()}>
          {size === "icon" ? (
            <Play className="h-5 w-5 fill-current" />
          ) : (
            <>
              <Film className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Watch Trailer</span>
            </>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className={`max-w-6xl w-full bg-black border-0 rounded-none overflow-hidden shadow-2xl p-0 ${
        isFullscreen ? 'h-screen w-screen max-w-none' : 'h-[80vh] rounded-xl border-2 border-gray-800/50'
      }`}>
        {/* Netflix-style Header Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 rounded-lg">
              <Film className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-white text-lg font-bold m-0">
                {isTrailer ? 'Movie Trailer' : 'Now Playing'}
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-sm m-0">
                {isTrailer ? 'Watch the official trailer' : 'Enjoy your movie'}
              </DialogDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Volume Control */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="text-white hover:bg-white/20 transition-all duration-300"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>

            {/* Fullscreen Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20 transition-all duration-300"
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          {/* YouTube Player */}
          <div className={`relative ${isFullscreen ? 'w-full h-full' : 'w-full h-full'} bg-black`}>
            <iframe
              src={getYouTubeUrl()}
              allow="autoplay; encrypted-media; fullscreen; accelerometer; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              title="Movie Trailer"
              style={{ border: 'none' }}
            />
            
            {/* Netflix-style Loading/Overlay Effects */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top Gradient */}
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/80 to-transparent"></div>
              
              {/* Bottom Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Side Gradients */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/50 to-transparent"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/50 to-transparent"></div>
              
              {/* Ambient Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-blue-600/5 mix-blend-overlay"></div>
            </div>

            {/* Playback Controls Overlay */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <span className="text-white text-sm font-medium">
                {isMuted ? 'Sound Off' : 'Sound On'}
              </span>
              <div className="w-1 h-1 bg-white/50 rounded-full"></div>
              <span className="text-white text-sm">
                {isFullscreen ? 'Press ESC to exit' : 'Double-click for fullscreen'}
              </span>
            </div>
          </div>
        </div>

        {/* Netflix-style Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-50 p-6 bg-gradient-to-t from-black/90 to-transparent">
          <div className="flex items-center justify-between">
            <div className="text-white text-sm">
              <p className="font-semibold">Playing: {isTrailer ? 'Official Trailer' : 'Full Movie'}</p>
              <p className="text-gray-400">YouTube • High Quality</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="h-4 w-4 mr-2" />
                    Unmute
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Mute
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 text-white hover:bg-red-600 hover:text-white transition-all duration-300 rounded-full w-10 h-10 bg-black/50 backdrop-blur-sm border border-white/20"
          onClick={() => document.querySelector('[data-state="open"] button')?.click()}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Ambient Light Effects */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-600/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
      </DialogContent>
    </Dialog>
  )
}