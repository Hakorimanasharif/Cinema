"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Play, Star, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import TrailerButton from "@/components/trailer-button"

export default function FeaturedSlider() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cinemax-8yem.onrender.com"
  const [currentSlide, setCurrentSlide] = useState(0)
  const [banners, setBanners] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string>("/placeholder-logo.svg")

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const count = banners.length
      if (count === 0) return 0
      return prev === count - 1 ? 0 : prev + 1
    })
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const count = banners.length
      if (count === 0) return 0
      return prev === 0 ? count - 1 : prev - 1
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 6000)
    return () => clearInterval(interval)
  }, [currentSlide])

  // Function to extract video ID from YouTube URL
  const extractVideoId = (url: string) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    return match ? match[1] : url
  }

  // Load active banners and logo from backend
  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Load banners
        const bannerRes = await fetch(`${API_BASE}/api/banners`)
        const bannerData = await bannerRes.json()
        if (!bannerRes.ok) throw new Error(bannerData?.error || "Failed to fetch banners")
        const mapped = bannerData.map((b: any) => ({
          id: b._id,
          title: b.title,
          description: b.description || 'Watch now for an amazing experience!',
          coverImage: b.imageUrl,
          videoId: extractVideoId(b.youtubeId || b.trailer || ''),
          rating: b.rating || 8.5,
          duration: b.duration || "2h 20m",
          year: b.year || 2024,
          genre: b.genre || ["Action", "Adventure"]
        }))
        setBanners(mapped)

        // Load logo from settings
        const settingsRes = await fetch(`${API_BASE}/api/settings`)
        const settingsData = await settingsRes.json()
        if (settingsRes.ok && settingsData.logo) {
          setLogoUrl(settingsData.logo)
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load banners")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [API_BASE])

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Slides */}
      {banners.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-110 pointer-events-none"
          }`}
        >
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute inset-0 z-10 bg-gradient-to-l from-black/30 via-transparent to-transparent" />
          
          <Image
            src={movie.coverImage || "/placeholder-image.jpg"}
            alt={movie.title}
            fill
            className="object-cover object-center"
            priority={index === 0}
            quality={90}
          />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-8">
          <div className="max-w-2xl">
            {banners.map((movie, index) => (
              <div
                key={movie.id}
                className={`transition-all duration-1000 ease-in-out ${
                  index === currentSlide
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-10 absolute"
                }`}
              >
                {/* Movie Badge */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-red-600/20 px-3 py-1 rounded-full border border-red-600/30">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm font-semibold">{movie.rating}/10</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{movie.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{movie.year}</span>
                  </div>
                </div>

                {/* Title with Enhanced Styling */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 uppercase tracking-tight 
                             bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent
                             drop-shadow-2xl font-['Bebas_Neue'] leading-tight">
                  {movie.title}
                </h1>

                {/* Genre Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genre.map((g: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm 
                               border border-white/20 hover:bg-white/20 transition-colors"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-3xl
                            drop-shadow-lg font-light">
                  {movie.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link href={`/play/${movie.id}`}>
                    <Button 
                      size="lg" 
                      className="bg-red-600 hover:bg-red-700 px-8 py-6 text-lg font-semibold
                               transform hover:scale-105 transition-all duration-300
                               shadow-lg shadow-red-600/25 hover:shadow-red-600/40"
                    >
                      <Play className="mr-3 h-5 w-5 fill-white" /> 
                      Watch Now
                    </Button>
                  </Link>
                  
                  {movie.videoId && (
                    <TrailerButton 
                      videoId={movie.videoId} 
                      className="bg-transparent hover:bg-white/10 border-2 border-white/30 
                               text-white px-8 py-6 text-lg font-semibold
                               backdrop-blur-sm hover:border-white/50
                               transform hover:scale-105 transition-all duration-300"
                    />
                  )}
                  
                  <Link href={`/movie/${movie.id}`}>
                    <Button 
                      variant="ghost"
                      className="text-white hover:text-white hover:bg-white/10 px-6 py-6 text-lg
                               backdrop-blur-sm border border-transparent hover:border-white/20
                               transform hover:scale-105 transition-all duration-300"
                    >
                      More Info
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-30 
                   bg-black/40 backdrop-blur-sm p-4 rounded-full 
                   hover:bg-black/60 transition-all duration-300 hover:scale-110
                   border border-white/20 hover:border-white/40"
        aria-label="Previous slide"
      >
        <ChevronLeft size={32} className="text-white" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-30 
                   bg-black/40 backdrop-blur-sm p-4 rounded-full 
                   hover:bg-black/60 transition-all duration-300 hover:scale-110
                   border border-white/20 hover:border-white/40"
        aria-label="Next slide"
      >
        <ChevronRight size={32} className="text-white" />
      </button>

      {/* Enhanced Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-1.5 rounded-full transition-all duration-500 ${
              index === currentSlide 
                ? "bg-red-600 w-12 shadow-lg shadow-red-600/50" 
                : "bg-white/40 hover:bg-white/60 w-6"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="https://res.cloudinary.com/dkmdeqbof/image/upload/v1760085572/movies/ykskrkwnkmqqbbz4eqbg.png"
              alt="Website Logo"
              width={120}
              height={120}
              className="animate-pulse"
              onError={() => setLogoUrl("/placeholder-logo.svg")}
            />
            <div className="text-white text-xl">Agasobanye +</div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-white text-xl text-center">
            <div>Failed to load banners</div>
            <div className="text-sm text-gray-400 mt-2">{error}</div>
          </div>
        </div>
      )}
    </div>
  )
}