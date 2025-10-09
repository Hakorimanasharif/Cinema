"use client"

import { useState, useEffect } from "react"
import FeaturedSlider from "@/components/featured-slider"
import MovieFilters from "@/components/movie-filters"
import CategoryRow from "@/components/category-row"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("popular")
  const [sortBy, setSortBy] = useState("newest")
  const [region, setRegion] = useState("All")
  const [translator, setTranslator] = useState("All")
  const [genre, setGenre] = useState("All")
  const [categories, setCategories] = useState<any[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cinemax-8yem.onrender.com"

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true)
      try {
        const res = await fetch(`${API_BASE}/api/categories`)
        const data = await res.json()
        if (res.ok) {
          setCategories(data)
        }
      } catch (error) {
        console.error("Failed to load categories", error)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    // Track visit
    const trackVisit = async () => {
      try {
        await fetch(`${API_BASE}/api/stats/visit`, {
          method: 'POST',
        })
      } catch (error) {
        console.error("Failed to track visit", error)
      }
    }

    loadCategories()
    trackVisit()
  }, [API_BASE])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <main className="pt-16">
        {/* Hero Banner */}
        <section className="relative h-[500px] md:h-[600px]">
          <FeaturedSlider />
        </section>

        {/* Filters */}
        <section className="px-4 py-6">
          <MovieFilters onRegionChange={setRegion} onTranslatorChange={setTranslator} onGenreChange={setGenre} />
        </section>

        {/* Category Rows */}
        <section className="px-4 py-4">
          <CategoryRow title="Trending Now" category="trending" />
          <CategoryRow title="New Releases" category="newest" />
          <CategoryRow title="TV Series" category="series" />
          {categories.map((cat) => (
            <CategoryRow key={cat._id} title={`${cat.name} Movies`} category={cat.name} />
          ))}
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
