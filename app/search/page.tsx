import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import MovieCard from "@/components/movie-card"

interface SearchPageProps {
  searchParams: { q: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
  const query = searchParams.q || ""
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!query) {
        setResults([])
        return
      }
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/api/movies?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Search failed")
        const mapped = (data || []).map((m: any) => ({
          id: m._id,
          title: m.title,
          year: m.year,
          posterImage: m.coverImage,
          trailerYouTubeId: m.trailerYouTubeId,
        }))
        setResults(mapped)
      } catch (e: any) {
        setError(e?.message || "Search failed")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [API_BASE, query])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-2xl font-bold mb-6">Search Results for "{query}"</h1>

        {isLoading && <p className="text-sm text-gray-400 mb-4">Searching...</p>}
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        {results.length === 0 && !isLoading ? (
          <div className="text-center py-12 bg-gray-900 rounded-lg">
            <Image
              src="/placeholder.svg?height=120&width=120"
              alt="No results"
              width={120}
              height={120}
              className="mx-auto mb-4 opacity-50"
            />
            <p className="text-xl text-gray-400 mb-2">No results found for "{query}"</p>
            <p className="text-sm text-gray-500 mb-6">Try different keywords or browse our categories</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/category/popular">
                <div className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm transition-colors">
                  Popular Movies
                </div>
              </Link>
              <Link href="/category/new">
                <div className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm transition-colors">
                  New Releases
                </div>
              </Link>
              <Link href="/category/action">
                <div className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm transition-colors">
                  Action
                </div>
              </Link>
              <Link href="/category/comedy">
                <div className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm transition-colors">
                  Comedy
                </div>
              </Link>
              <Link href="/category/animation">
                <div className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm transition-colors">
                  Animation
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

