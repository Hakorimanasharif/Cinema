"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import CategoryFilter from "@/components/category-filter"
import MovieFilters from "@/components/movie-filters"
import SearchBar from "@/components/search-bar"
import WhatsAppButton from "@/components/whatsapp-button"
import { getRwandanMovies } from "@/lib/data"

export default function RwandanMoviesPage() {
  const [sortBy, setSortBy] = useState("newest")
  const [region, setRegion] = useState("Rwandan")
  const [translator, setTranslator] = useState("All")
  const [genre, setGenre] = useState("All")

  const movies = getRwandanMovies()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header/Navigation */}
      <header className="flex items-center justify-between p-4 bg-black/90 border-b border-gray-800">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl font-bold text-red-600">Cinemax</h1>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/tv" className="text-sm hover:text-red-500 transition-colors duration-200">
              TV
            </Link>
            <Link href="/movies" className="text-sm hover:text-red-500 transition-colors duration-200">
              Movies
            </Link>
            <Link href="/category/animation" className="text-sm hover:text-red-500 transition-colors duration-200">
              Animation
            </Link>
            <Link href="/category/rwandan" className="text-sm text-red-500 transition-colors duration-200">
              Rwandan
            </Link>
            <Link href="/sports" className="text-sm hover:text-red-500 transition-colors duration-200">
              Sports
            </Link>
            <Link href="/premium" className="text-sm hover:text-red-500 transition-colors duration-200">
              Premium
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <SearchBar />
          <Link href="/login" className="text-sm hover:text-red-500 transition-colors duration-200">
            Login
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Home
            </Button>
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-300">Rwandan Movies</span>
        </div>

        <h1 className="text-3xl font-bold mb-6">Rwandan Movies</h1>

        <MovieFilters onRegionChange={setRegion} onTranslatorChange={setTranslator} onGenreChange={setGenre} />

        <CategoryFilter onCategoryChange={() => {}} onSortChange={setSortBy} hideCategories />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <Link key={movie.id} href={`/movie/${movie.id}`} className="group">
              <div className="relative aspect-[2/3] overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105">
                <Image src={movie.posterImage || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
              </div>
              <h3 className="mt-2 text-sm font-medium truncate">{movie.title}</h3>
              <p className="text-xs text-gray-400">{movie.year}</p>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/90 border-t border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-400">© 2025 Cinemax. All rights reserved.</p>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  )
}

