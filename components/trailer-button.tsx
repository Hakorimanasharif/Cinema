"use client"

import { Film } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 ${className}`}>
          <Film className="mr-2 h-4 w-4" /> Trailer
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full h-96">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full"
        />
      </DialogContent>
    </Dialog>
  )
}
