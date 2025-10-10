"use client"

import { Film, Play, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface TrailerButtonProps {
  videoId: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
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
}: TrailerButtonProps) {
  const videoId = extractVideoId(rawVideoId)

  const getButtonClass = () => {
    const baseClass = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variantClass = {
      default: "bg-red-600 text-white hover:bg-red-700 hover:scale-105 border border-red-600 shadow-lg",
      outline: "border-2 border-red-500/80 text-red-500 bg-transparent hover:bg-red-500/10 hover:border-red-500 hover:scale-105 hover:shadow-lg",
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
      <DialogContent className="max-w-6xl w-full h-[70vh] bg-black border-2 border-gray-800/50 rounded-xl overflow-hidden shadow-2xl p-0">
       
        <div className="flex flex-col h-full">
          
          
          {/* Video Container */}
          <div className="flex-1 relative  p-6">
            <div className="relative w-full h-full bg-gray-900/30 rounded-xl overflow-hidden border-2 border-gray-700/50 shadow-inner">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="absolute inset-0 w-full h-full rounded-lg"
                title="Movie Trailer"
              />
              
              {/* Cinematic Overlay Effects */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/70 to-transparent"></div>
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/70 to-transparent"></div>
              </div>

              
              
            </div>
          </div>

          
        </div>
      </DialogContent>
    </Dialog>
  )
}