"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Play, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

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
          description: b.title,
          coverImage: b.imageUrl,
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
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
          <Image
            src={movie.coverImage || ""}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20 max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">NEW</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-2">{movie.title}</h2>
            <p className="text-sm md:text-base text-gray-300 mb-6 max-w-2xl line-clamp-3">{movie.description}</p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/movie/${movie.id}`}>
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  <Play className="mr-2 h-5 w-5 fill-white" /> Play Now
                </Button>
              </Link>
              <Link href={`/movie/${movie.id}`}>
                <Button variant="outline" size="lg">
                  <Info className="mr-2 h-5 w-5" /> More Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 p-2 rounded-full hover:bg-black/70"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 p-2 rounded-full hover:bg-black/70"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full ${index === currentSlide ? "bg-red-600" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

