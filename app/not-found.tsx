"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Home, Search, Tv, AlertTriangle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import MovieCard from "@/components/movie-card"
import LoadingSpinner from "@/components/loading-spinner"

export default function NotFoundPage() {
  const [relatedMovies, setRelatedMovies] = useState<any[]>([])
  const [loadingMovies, setLoadingMovies] = useState(true)

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cinemax-8yem.onrender.com"

  useEffect(() => {
    const loadRelatedMovies = async () => {
      setLoadingMovies(true)
      try {
        const res = await fetch(`${API_BASE}/api/movies?limit=6`)
        const data = await res.json()
        if (res.ok) {
          const mapped = data.map((m: any) => ({
            id: m._id,
            title: m.title,
            year: m.year,
            posterImage: m.coverImage,
            trailerYouTubeId: m.trailerYouTubeId,
          }))
          setRelatedMovies(mapped)
        }
      } catch (e) {
        console.error("Failed to load movies:", e)
      } finally {
        setLoadingMovies(false)
      }
    }
    loadRelatedMovies()
  }, [API_BASE])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <main className="pt-16">
        {/* Netflix-style 404 Hero Section */}
        <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900/10 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600/5 via-black to-black" />
          
          {/* Animated Background Elements */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-400/5 rounded-full blur-3xl" />
          
          {/* Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            {/* Error Code with Netflix Style */}
            <div className="mb-8">
              <div className="text-[120px] md:text-[180px] font-black leading-none bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent font-['Bebas_Neue']">
                4
                <span className="text-red-600 mx-2">0</span>
                4
              </div>
            </div>

            {/* Main Message */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Lost in the Stream?
                </h1>
              </div>
              <p className="text-xl text-gray-300 mb-2 max-w-2xl mx-auto">
                This page seems to be missing. It might have been removed or you may have entered the wrong URL.
              </p>
              <p className="text-lg text-gray-400">
                Don't worry, there's plenty more to watch.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full bg-red-600 hover:bg-red-700 px-8 py-6 text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg shadow-red-600/25"
                >
                  <Home className="mr-3 h-5 w-5" />
                  Back to Homepage
                </Button>
              </Link>
              
              <Link href="/browse" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full bg-transparent hover:bg-white/10 border-2 border-white/30 text-white px-8 py-6 text-lg font-semibold backdrop-blur-sm hover:border-white/50 transform hover:scale-105 transition-all duration-300"
                >
                  <Tv className="mr-3 h-5 w-5" />
                  Browse Movies
                </Button>
              </Link>
            </div>

            {/* Quick Tips */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Tips:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Search className="w-4 h-4 text-red-500" />
                  <span>Use the search bar</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Home className="w-4 h-4 text-red-500" />
                  <span>Check the homepage</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Play className="w-4 h-4 text-red-500" />
                  <span>Browse categories</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Movies Section */}
        
        {/* Netflix-style Bottom Gradient */}
        <div className="h-32 bg-gradient-to-t from-black to-transparent -mt-32 relative z-10" />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}