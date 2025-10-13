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

interface Movie {
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
  views?: number
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [loading, setLoading] = useState(true)
  const [region, setRegion] = useState("All")
  const [translator, setTranslator] = useState("All")
  const [genre, setGenre] = useState("All")

  const categories = ["All", "Action", "Sci-Fi", "Adventure", "Drama", "Comedy", "Horror"]

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedCategory !== "All") params.append("category", selectedCategory)
        if (searchTerm) params.append("q", searchTerm)
        if (sortBy) params.append("sort", sortBy)
        if (region !== "All") params.append("region", region)
        if (translator !== "All") params.append("translator", translator)
        if (genre !== "All") params.append("category", genre)

        const res = await fetch(`https://cinemax-8yem.onrender.com/api/movies?${params}`)
        const data = await res.json()
        if (res.ok) {
          // Filter out animation and rwandan movies
          const filteredMovies = data.filter((movie: Movie) =>
            movie.category?.toLowerCase() !== 'animation' &&
            movie.category?.toLowerCase() !== 'rwandan'
          )
          setMovies(filteredMovies)
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [searchTerm, selectedCategory, sortBy, region, translator, genre])

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || movie.category === selectedCategory
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
          <Image src="https://i.pinimg.com/1200x/d5/8b/44/d58b44e8b8ccf180a50c8e6acfd4fd2e.jpg" alt="Movies" fill className="object-cover" priority />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Movies</h1>
            <p className="text-sm md:text-base text-gray-300 mb-6 max-w-2xl">
              Explore our vast collection of movies from around the world. From blockbuster hits to indie gems, we have
              something for everyone.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/movies">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Browse Movies
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Filters */}
          <section className="mb-8">
            <MovieFilters onRegionChange={setRegion} onTranslatorChange={setTranslator} onGenreChange={setGenre} />
          </section>

          {/* Search and Filter Bar */}
          <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search movies..."
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

          {/* Movies Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredMovies.length === 0 ? (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No movies found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredMovies.map((movie) => (
                <Card
                  key={movie._id}
                  className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden group hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative">
                    <Link href={`/movie/${movie._id}`}>
                      <div className="aspect-[2/3] relative overflow-hidden">
                        <Image
                          src={movie.coverImage || "/placeholder.svg"}
                          alt={movie.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex flex-col gap-2">
                        <Link href={`/movie/${movie._id}`}>
                          <Button size="icon" className="w-12 h-12 rounded-full">
                            <Play className="w-6 h-6" />
                          </Button>
                        </Link>
                        {movie.trailerYouTubeId && (
                          <TrailerButton videoId={movie.trailerYouTubeId} variant="outline" size="sm" />
                        )}
                      </div>
                    </div>
                    {movie.category && (
                      <Badge className="absolute top-2 left-2" variant="secondary">
                        {movie.category}
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Link href={`/movie/${movie._id}`}>
                        <h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
                          {movie.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {movie.year}
                        </div>
                        {movie.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-primary fill-primary" />
                            <span className="font-medium">{String(movie.rating)}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">{movie.description}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <span className="text-xs text-muted-foreground">By {movie.translator}</span>
                        {movie.views && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Eye className="w-3 h-3" />
                            {movie.views}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
