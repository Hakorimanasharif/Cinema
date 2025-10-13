"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Search, Filter, Star, Calendar, Eye } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import MovieFilters from "@/components/movie-filters"
import TrailerButton from "@/components/trailer-button"

interface Series {
  _id: string
  title: string
  description?: string
  year?: number
  rating?: string | number
  coverImage?: string
  trailerYouTubeId?: string
  category?: string
  region?: string
  translator?: string
  seasons?: any[]
  views?: number
}

export default function TVPage() {
  const [series, setSeries] = useState<Series[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [loading, setLoading] = useState(true)
  const [region, setRegion] = useState("All")
  const [translator, setTranslator] = useState("All")
  const [genre, setGenre] = useState("All")

  const categories = ["All", "Action", "Sci-Fi", "Adventure", "Drama", "Comedy", "Horror"]

  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedCategory !== "All") params.append("category", selectedCategory)
        if (searchTerm) params.append("q", searchTerm)
        if (sortBy) params.append("sort", sortBy)
        if (region !== "All") params.append("region", region)
        if (translator !== "All") params.append("translator", translator)
        if (genre !== "All") params.append("category", genre)

        const res = await fetch(`https://cinemax-8yem.onrender.com/api/series?${params}`)
        const data = await res.json()
        if (res.ok) {
          setSeries(data)
        }
      } catch (error) {
        console.error("Failed to fetch series:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSeries()
  }, [searchTerm, selectedCategory, sortBy, region, translator, genre])

  const filteredSeries = series.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <main className="pt-16">
        {/* Hero Banner */}
        <section className="relative h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
          <Image src="https://i.pinimg.com/736x/c8/98/74/c898748134484d2355cc644f26c800d0.jpg" alt="TV Shows" fill className="object-cover" priority />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">TV Shows</h1>
            <p className="text-sm md:text-base text-gray-300 mb-6 max-w-2xl">
              Discover the latest TV series and binge-worthy shows. From drama to comedy, we have something for
              everyone.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/tv">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Browse Shows
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="px-4 py-6">
          <MovieFilters onRegionChange={setRegion} onTranslatorChange={setTranslator} onGenreChange={setGenre} />
        </section>

        {/* Search and Filter Bar */}
        <section className="px-4 py-8">
          <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search series..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Series Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredSeries.length === 0 ? (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No series found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredSeries.map((s) => (
                <Card
                  key={s._id}
                  className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden group hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative">
                    <Link href={`/series/${s._id}`}>
                      <div className="aspect-[2/3] relative overflow-hidden">
                        <Image
                          src={s.coverImage || "/placeholder.svg"}
                          alt={s.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex flex-col gap-2">
                        <Link href={`/series/${s._id}`}>
                          <Button size="icon" className="w-12 h-12 rounded-full" style={{marginLeft:"60px"}}>
                            <Play className="w-6 h-6" />
                          </Button>
                        </Link>
                        {s.trailerYouTubeId && (
                          <TrailerButton videoId={s.trailerYouTubeId} variant="outline" size="sm" />
                        )}
                      </div>
                    </div>
                    {s.category && (
                      <Badge className="absolute top-2 left-2" variant="secondary">
                        {s.category}
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Link href={`/series/${s._id}`}>
                        <h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
                          {s.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {s.year}
                        </div>
                        {s.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-primary fill-primary" />
                            <span className="font-medium">{String(s.rating)}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">By {s.translator}</span>
                        {s.views && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Eye className="w-3 h-3" />
                            {s.views}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
