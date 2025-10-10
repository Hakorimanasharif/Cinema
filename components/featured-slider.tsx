"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import TrailerButton from "@/components/trailer-button"

export default function FeaturedSlider() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cinemax-8yem.onrender.com"
  const [currentSlide, setCurrentSlide] = useState(0)
  const [banners, setBanners] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    }, 5000)
    return () => clearInterval(interval)
  }, [currentSlide])

  // Function to extract video ID from YouTube URL
  const extractVideoId = (url: string) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    return match ? match[1] : url // If not a URL, assume it's already videoId
  }

  // Load active banners from backend
  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/api/banners`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Failed to fetch banners")
        const mapped = data.map((b: any) => ({
          id: b._id,
          title: b.title,
          description: b.description || b.title,
          coverImage: b.imageUrl,
          videoId: extractVideoId(b.youtubeId || b.trailer || ''),
        }))
        setBanners(mapped)
      } catch (e: any) {
        setError(e?.message || "Failed to load banners")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [API_BASE])

  return (
    <div className="relative h-full overflow-hidden">
      {(isLoading ? [] : banners).map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide 
              ? "opacity-100 transform translate-x-0" 
              : "opacity-0 pointer-events-none transform translate-x-full"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
          <Image
            src={movie.coverImage || ""}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          
          {/* Centered Content with Animations */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 px-8">
            <div className={`transform transition-all duration-700 delay-300 ${
              index === currentSlide 
                ? "translate-y-0 opacity-100" 
                : "translate-y-10 opacity-0"
            }`}>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 uppercase tracking-tight 
                           bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent
                           drop-shadow-2xl font-['Bebas_Neue']">
                {movie.title}
              </h2>
            </div>
            
            <div className={`transform transition-all duration-700 delay-500 max-w-2xl ${
              index === currentSlide 
                ? "translate-y-0 opacity-100" 
                : "translate-y-10 opacity-0"
            }`}>
              <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed 
                          drop-shadow-lg font-light">
                {movie.description}
              </p>
            </div>
            
            <div className={`transform transition-all duration-700 delay-700 flex flex-wrap gap-4 justify-center ${
              index === currentSlide 
                ? "translate-y-0 opacity-100" 
                : "translate-y-10 opacity-0"
            }`}>
              <Link href={`/movie/${movie.id}`}>
                <Button size="lg" className="bg-red-600 hover:bg-red-700 px-8 py-6 text-lg 
                                           transform hover:scale-105 transition-transform duration-300">
                  <Play className="mr-2 h-5 w-5 fill-white" /> Play Now
                </Button>
              </Link>
              {movie.videoId && <TrailerButton videoId={movie.videoId} />}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 p-3 rounded-full 
                   hover:bg-black/70 transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 p-3 rounded-full 
                   hover:bg-black/70 transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-red-600 scale-125" 
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}