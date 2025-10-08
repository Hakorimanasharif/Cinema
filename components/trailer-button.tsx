"use client"

import { useState } from "react"
import { Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import YouTubePlayer from "@/components/youtube-player"

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
  const [showTrailer, setShowTrailer] = useState(false)

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setShowTrailer(true)} className={className}>
        <Film className="mr-2 h-4 w-4" /> Trailer
      </Button>

      {showTrailer && <YouTubePlayer videoId={videoId} onClose={() => setShowTrailer(false)} isTrailer={true} />}
    </>
  )
}

