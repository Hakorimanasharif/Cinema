"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, Mic, Star, Heart, Share2 } from "lucide-react"
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
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-gray-300/20 bg-gray-900/50 transition-all duration-500 ease-out group-hover/card:scale-105 group-hover/card:shadow-2xl group-hover/card:shadow-red-500/20">
        {/* Main Image */}
        <Image
          src={movie.id === "25" ? "/images/fast-x.jpg" : movie.posterImage || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-700 group-hover/card:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-500" />
        
        {/* Top Section - Share & Rating */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-100">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-white">{movie.rating || "4.5"}</span>
          </div>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8 bg-black/60 backdrop-blur-sm hover:bg-red-600/80 rounded-full transition-all duration-300 hover:scale-110"
            >
              <Heart className="w-3 h-3 text-white" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8 bg-black/60 backdrop-blur-sm hover:bg-blue-600/80 rounded-full transition-all duration-300 hover:scale-110"
            >
              <Share2 className="w-3 h-3 text-white" />
            </Button>
          </div>
        </div>

        {/* Center Section - Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-150">
          <Link href={`/movie/${movie.id}`}>
            <Button 
              size="icon" 
              className="rounded-full bg-red-600 hover:bg-red-700 shadow-2xl w-16 h-16 transition-all duration-300 hover:scale-110 border-2 border-white/20"
            >
              <Play className="h-7 w-7 fill-white ml-1" />
            </Button>
          </Link>
        </div>

        {/* Bottom Section - Trailer & Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-6 group-hover/card:translate-y-0 transition-transform duration-500">
          {/* Trailer Button */}
          {movie.trailerYouTubeId && (
            <div className="flex justify-center mb-4 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-200">
              <TrailerButton 
                videoId={movie.trailerYouTubeId}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 shadow-lg transition-all duration-300 hover:scale-110"
              />
            </div>
          )}

          {/* Movie Info */}
          <div className="text-center space-y-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-300">
            <h3 className="text-white font-bold text-sm line-clamp-1 drop-shadow-lg">{movie.title}</h3>
            <div className="flex items-center justify-center gap-3 text-xs text-gray-200">
              <span>{movie.year}</span>
              {movie.duration && (
                <>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>{movie.duration}</span>
                </>
              )}
            </div>
            {movie.translator && (
              <p className="text-xs text-gray-300 flex items-center justify-center gap-1">
                <Mic className="w-3 h-3" />
                {movie.translator}
              </p>
            )}
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-1000" />
      </div>

      {/* Default Visible Info (when not hovering) */}
      <div className="mt-3 space-y-1 group-hover/card:opacity-0 transition-opacity duration-300">
        <h3 className="text-sm font-semibold text-white truncate">{movie.title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">{movie.year}</p>
          {movie.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-400">{movie.rating}</span>
            </div>
          )}
        </div>
        {movie.translator && (
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Mic className="w-3 h-3" />
            {movie.translator}
          </p>
        )}
      </div>
    </div>
  )
}