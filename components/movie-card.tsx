"use client"
import Image from "next/image"
import Link from "next/link"
import { Play, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import TrailerButton from "@/components/trailer-button"
import type { Movie } from "@/lib/data"

interface MovieCardProps {
  movie: Movie
  className?: string
}

export default function MovieCard({ movie, className = "" }: MovieCardProps) {
  return (
    <div className={`group/card flex-none ${className}`}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-md transition-transform duration-300 group-hover/card:scale-105">
        <Image
          src={movie.id === "25" ? "/images/fast-x.jpg" : movie.posterImage || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/60 transition-colors duration-300 flex flex-col items-center justify-center opacity-0 group-hover/card:opacity-100">
          <Link href={`/play/${movie.id}`}>
            <Button size="icon" className="rounded-full bg-red-600 hover:bg-red-700 mb-2">
              <Play className="h-5 w-5 fill-white" />
            </Button>
          </Link>
          {movie.trailerYouTubeId && <TrailerButton videoId={movie.trailerYouTubeId} />}
        </div>
      </div>
      <h3 className="mt-2 text-sm font-medium truncate">{movie.title}</h3>
      <p className="text-xs text-gray-400">{movie.year}</p>
      {movie.translator && (
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <Mic className="w-3 h-3" />
          {movie.translator}
        </p>
      )}
    </div>
  )
}

