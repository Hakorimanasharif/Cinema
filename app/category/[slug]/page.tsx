"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import MovieGrid from "@/components/movie-grid"
import CategoryFilter from "@/components/category-filter"
import MovieFilters from "@/components/movie-filters"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useEffect } from "react"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params
  const [sortBy, setSortBy] = useState("newest")
  const [region, setRegion] = useState("All")
  const [translator, setTranslator] = useState("All")
  const [genre, setGenre] = useState("All")
  const categoryTitle = slug.charAt(0).toUpperCase() + slug.slice(1)

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
          <span className="text-gray-300">{categoryTitle}</span>
        </div>

        <h1 className="text-3xl font-bold mb-6">{categoryTitle}</h1>

        <MovieFilters onRegionChange={setRegion} onTranslatorChange={setTranslator} onGenreChange={setGenre} />

        <CategoryFilter onCategoryChange={() => {}} onSortChange={setSortBy} hideCategories />

        <MovieGrid category={slug} sortBy={sortBy} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
