"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, X } from "lucide-react"

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cinemax-8yem.onrender.com"

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true)
        try {
          const res = await fetch(`${API_BASE}/api/movies?q=${encodeURIComponent(searchQuery)}`)
          const data = await res.json()
          if (res.ok) {
            const mapped = (data || []).slice(0, 5).map((m: any) => ({
              id: m._id,
              title: m.title,
              year: m.year,
              posterImage: m.coverImage,
              genres: [m.category].filter(Boolean), // Use category as genre
            }))
            setSearchResults(mapped)
          } else {
            setSearchResults([])
          }
        } catch (error) {
          console.error("Search failed:", error)
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }

    const debounceTimer = setTimeout(fetchSearchResults, 300) // Debounce for 300ms
    return () => clearTimeout(debounceTimer)
  }, [searchQuery, API_BASE])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsExpanded(false)
    }
  }

  const handleFocus = () => {
    setIsExpanded(true)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setIsSearching(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div ref={searchContainerRef} className="relative">
      <form
        onSubmit={handleSearch}
        className={`flex items-center transition-all duration-300 ${
          isExpanded ? "bg-gray-800 w-[300px]" : "bg-gray-900/50 w-[200px]"
        } rounded-full overflow-hidden border border-gray-700 focus-within:border-gray-500`}
      >
        <input
          ref={inputRef}
          type="search"
          placeholder="Search movies, TV..."
          className="bg-transparent border-none text-white placeholder:text-gray-400 px-4 py-2 w-full focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
        />

        {searchQuery && (
          <button
            type="button"
            className="text-gray-400 hover:text-white p-2"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}

        <button type="submit" className="text-gray-400 hover:text-white p-2" aria-label="Search">
          <Search size={16} />
        </button>
      </form>

      {/* Search results dropdown */}
      {isExpanded && searchQuery.trim().length > 1 && (
        <div className="absolute top-full right-0 mt-2 w-[350px] max-h-[70vh] overflow-y-auto bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-50">
          {isSearching ? (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-400">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="p-3 border-b border-gray-800">
                <h3 className="text-sm font-medium">Search Results</h3>
              </div>
              <ul>
                {searchResults.map((movie) => (
                  <li key={movie.id} className="border-b border-gray-800 last:border-b-0">
                    <Link
                      href={`/movie/${movie.id}`}
                      className="flex items-center p-3 hover:bg-gray-800 transition-colors"
                      onClick={() => setIsExpanded(false)}
                    >
                      <div className="relative w-12 h-16 flex-shrink-0">
                        <Image
                          src={movie.posterImage && movie.posterImage.trim() ? movie.posterImage : "/placeholder.svg"}
                          alt={movie.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <h4 className="text-sm font-medium">{movie.title}</h4>
                        <p className="text-xs text-gray-400">
                          {movie.year} • {movie.genres.slice(0, 2).join(", ")}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="p-3 border-t border-gray-800">
                <Link
                  href={`/search?q=${encodeURIComponent(searchQuery)}`}
                  className="text-sm text-red-500 hover:text-red-400"
                  onClick={() => setIsExpanded(false)}
                >
                  View all results
                </Link>
              </div>
            </>
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-400">No results found for "{searchQuery}"</p>
              <p className="text-xs text-gray-500 mt-1">Try different keywords or browse categories</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

