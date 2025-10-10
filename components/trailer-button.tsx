"use client"

import { Film } from "lucide-react"
import {
  Dialog,
  DialogContent,
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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 ${className}`}>
          <Film className="mr-2 h-4 w-4" /> Trailer
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full h-96" aria-describedby="trailer-description">
        <DialogTitle>Trailer</DialogTitle>
        <DialogDescription id="trailer-description">Watch the movie trailer</DialogDescription>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full"
        />
      </DialogContent>
    </Dialog>
  )
}
