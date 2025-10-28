"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Play, Star, Clock, Calendar, ArrowRight } from "lucide-react"
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
    }, 6000)
    return () => clearInterval(interval)
  }, [currentSlide])

  // Function to extract video ID from YouTube URL
  const extractVideoId = (url: string) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    return match ? match[1] : url
  }

  // Load active banners from backend
  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const bannerRes = await fetch(`${API_BASE}/api/banners`)
        const bannerData = await bannerRes.json()
        if (!bannerRes.ok) throw new Error(bannerData?.error || "Failed to fetch banners")
        
        const mapped = bannerData.map((b: any) => ({
          id: b._id,
          title: b.title,
          description: b.description || 'Experience the ultimate cinematic adventure',
          coverImage: b.imageUrl,
          videoId: extractVideoId(b.youtubeId || b.trailer || ''),
          rating: b.rating || (8 + Math.random() * 0.5).toFixed(1),
          duration: b.duration || `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
          year: b.year || 2024,
          genre: b.genre || ["Action", "Adventure", "Drama"].slice(0, 2 + Math.floor(Math.random() * 2))
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

  // Get next slide index
  const getNextSlideIndex = () => {
    if (banners.length === 0) return 0
    return (currentSlide + 1) % banners.length
  }

  const nextSlideIndex = getNextSlideIndex()
  const nextMovie = banners[nextSlideIndex]

  if (isLoading) {
    return (
      <div className="relative h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-red-400 rounded-full animate-spin animation-delay-500"></div>
          </div>
          <div className="text-white text-2xl font-light tracking-widest animate-pulse">PREPARING CINEMATIC EXPERIENCE</div>
        </div>
      </div>
    )
  }

  if (error || banners.length === 0) {
    return (
      <div className="relative h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center text-white max-w-2xl px-8">
          <div className="text-8xl mb-6 animate-bounce">🎬</div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">CINEMA EXPERIENCE</h2>
          <p className="text-xl text-gray-400 leading-relaxed">Immerse yourself in world-class storytelling. New featured content arriving soon.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      {/* Background Slides - Larger and More Prominent */}
      {banners.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
            index === currentSlide 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-105 pointer-events-none"
          }`}
        >
          {/* Reduced Gradient Overlays to Show More Image */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
          
          {/* Larger Background Image */}
          <Image
            src={movie.coverImage || "/placeholder-image.jpg"}
            alt={movie.title}
            fill
            className="object-cover scale-100"
            priority={index === 0}
            quality={100}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="max-w-3xl">
            {banners.map((movie, index) => (
              <div
                key={movie.id}
                className={`transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                  index === currentSlide
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-12 absolute"
                }`}
              >
                {/* Movie Badge & Info */}
                <div className="flex items-center gap-8 mb-8">
                  <div className="flex items-center gap-3 bg-gradient-to-r from-red-600 via-red-500 to-red-600 px-5 py-2 rounded-xl border border-red-400/30 shadow-lg backdrop-blur-sm">
                    <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                    <span className="text-white text-lg font-bold">{movie.rating}</span>
                  </div>
                  <div className="flex items-center gap-6 text-gray-200">
                    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                      <Clock className="w-4 h-4 text-red-400" />
                      <span className="text-base font-medium">{movie.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                      <Calendar className="w-4 h-4 text-red-400" />
                      <span className="text-base font-medium">{movie.year}</span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-6xl md:text-8xl font-black mb-6 uppercase tracking-tight 
                             bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent
                             drop-shadow-2xl font-['Bebas_Neue'] leading-none">
                  {movie.title}
                </h1>

                {/* Description */}
                <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl
                            drop-shadow-lg font-light">
                  {movie.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <Link href={`/play/${movie.id}`}>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 
                               px-10 py-6 text-lg font-bold rounded-xl
                               transform hover:scale-105 transition-all duration-300
                               shadow-lg shadow-red-600/30 hover:shadow-red-600/50"
                    >
                      <Play className="mr-3 h-5 w-5 fill-white" /> 
                      WATCH NOW
                    </Button>
                  </Link>
                  
                  {movie.videoId && (
                    <TrailerButton 
                      videoId={movie.videoId}
                      size="lg"
                      className="bg-white/10 backdrop-blur-lg hover:bg-white/20 border border-white/30 
                               text-white px-8 py-6 text-lg font-bold rounded-xl
                               hover:border-white/50 transform hover:scale-105 transition-all duration-300
                               shadow-lg hover:shadow-white/10"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Slide Preview Card - Left Side */}
      {nextMovie && (
        <div className="absolute left-8 bottom-8 z-30">
          <div className="flex flex-col items-start gap-4">
            {/* "Next" Label */}
            <div className="flex items-center gap-2 text-white/80">
              <span className="text-sm font-semibold tracking-wider uppercase">NEXT</span>
              <ArrowRight className="w-4 h-4" />
            </div>
            
            {/* Preview Card */}
            <button
              onClick={() => setCurrentSlide(nextSlideIndex)}
              className="group relative transition-all duration-500 ease-out hover:scale-105"
            >
              <div className="relative w-24 h-32 rounded-lg overflow-hidden shadow-2xl border-2 border-white/20 hover:border-white/40">
                <Image
                  src={nextMovie.coverImage || "/placeholder-image.jpg"}
                  alt={nextMovie.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="96px"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                
                {/* Play Icon on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-red-600/80 p-2 rounded-full backdrop-blur-sm">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                </div>
                
                {/* Movie Info */}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <div className="text-left">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-xs font-bold">{nextMovie.rating}</span>
                    </div>
                    <h3 className="text-white text-xs font-semibold leading-tight line-clamp-2">
                      {nextMovie.title}
                    </h3>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-30 
                   bg-black/60 backdrop-blur-lg p-4 rounded-xl 
                   hover:bg-black/80 transition-all duration-300 hover:scale-110
                   border border-white/20 hover:border-red-500/50 shadow-lg group"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} className="text-white group-hover:text-red-400 transition-colors" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-30 
                   bg-black/60 backdrop-blur-lg p-4 rounded-xl 
                   hover:bg-black/80 transition-all duration-300 hover:scale-110
                   border border-white/20 hover:border-red-500/50 shadow-lg group"
        aria-label="Next slide"
      >
        <ChevronRight size={24} className="text-white group-hover:text-red-400 transition-colors" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 right-8 z-30">
        <div className="flex items-center gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-500 ease-out rounded-full ${
                index === currentSlide 
                  ? "w-8 h-2 bg-red-600 shadow-lg shadow-red-600/50" 
                  : "w-6 h-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Current Slide Indicator */}
      <div className="absolute top-8 left-8 z-30">
        <div className="bg-black/60 backdrop-blur-lg px-4 py-2 rounded-xl border border-white/20">
          <span className="text-white text-sm font-bold">
            <span className="text-red-400">{currentSlide + 1}</span>
            <span className="text-white/60"> / {banners.length}</span>
          </span>
        </div>
      </div>
    </div>
  )
}