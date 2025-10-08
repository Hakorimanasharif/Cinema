"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import MovieFilters from "@/components/movie-filters"
import CategoryFilter from "@/components/category-filter"
import { getMoviesByRegion } from "@/lib/data"
import MovieCard from "@/components/movie-card"

interface RegionPageProps {
  params: {
    slug: string
  }
}

export default function RegionPage({ params }: RegionPageProps) {
  const { slug } = params
  const [sortBy, setSortBy] = useState("newest")
  const [translator, setTranslator] = useState("All")
  const [genre, setGenre] = useState("All")

  // Capitalize first letter for display
  const regionName = slug.charAt(0).toUpperCase() + slug.slice(1)

  // Get movies by region
  const movies = getMoviesByRegion(slug)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Home
            </Button>
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-300">{regionName} Movies</span>
        </div>

        <h1 className="text-3xl font-bold mb-6">{regionName} Movies</h1>

        <MovieFilters
          onRegionChange={() => {}}
          onTranslatorChange={setTranslator}
          onGenreChange={setGenre}
          initialRegion={regionName}
        />

        <CategoryFilter onCategoryChange={() => {}} onSortChange={setSortBy} hideCategories />

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-900 rounded-lg">
            <p className="text-xl text-gray-400 mb-2">No movies found for this region</p>
            <p className="text-sm text-gray-500 mb-6">Try a different region or browse our categories</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

