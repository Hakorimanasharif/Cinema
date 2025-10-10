"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

interface MovieFiltersProps {
  onRegionChange: (region: string) => void
  onTranslatorChange: (translator: string) => void
  onGenreChange: (genre: string) => void
  initialRegion?: string
  initialTranslator?: string
  initialGenre?: string
}

export default function MovieFilters({
  onRegionChange,
  onTranslatorChange,
  onGenreChange,
  initialRegion = "All",
  initialTranslator = "All",
  initialGenre = "All",
}: MovieFiltersProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>(initialRegion)
  const [selectedTranslator, setSelectedTranslator] = useState<string>(initialTranslator)
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre)
  const [regions, setRegions] = useState<string[]>([])
  const [translators, setTranslators] = useState<string[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [isLoadingFilters, setIsLoadingFilters] = useState(true)
  const router = useRouter()

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cinemax-8yem.onrender.com"

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [regionsRes, translatorsRes, genresRes] = await Promise.all([
          fetch(`${API_BASE}/api/regions`),
          fetch(`${API_BASE}/api/translators`),
          fetch(`${API_BASE}/api/categories`)
        ])
        const regionsData = await regionsRes.json()
        const translatorsData = await translatorsRes.json()
        const genresData = await genresRes.json()
        setRegions(["All", ...regionsData])
        setTranslators(["All", ...translatorsData.map((t: any) => t.name)])
        setGenres(["All", ...genresData.map((c: any) => c.name)])
      } catch (error) {
        console.error("Failed to load filters", error)
        // Fallback to hardcoded values
        setRegions(["All", "American", "Indian", "Korean", "Nigerian", "Rwandan", "European", "Chinese"])
        setTranslators(["All", "Rocky", "Sankara", "Junior Giti", "Savimbi", "Official"])
        setGenres(["All", "Action", "Comedy", "Drama", "Horror", "Animation", "Romance", "Sci-Fi", "Thriller"])
      } finally {
        setIsLoadingFilters(false)
      }
    }
    fetchFilters()
  }, [API_BASE])

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region)
    onRegionChange(region)

    if (region !== "All") {
      router.push(`/filter/region/${region.toLowerCase()}`)
    }
  }

  const handleTranslatorChange = (translator: string) => {
    setSelectedTranslator(translator)
    onTranslatorChange(translator)

    if (translator !== "All") {
      router.push(`/filter/translator/${translator.toLowerCase().replace(/\s+/g, "-")}`)
    }
  }

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre)
    onGenreChange(genre)

    if (genre !== "All") {
      router.push(`/filter/genre/${genre.toLowerCase()}`)
    }
  }

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {isLoadingFilters ? (
        <div className="flex items-center justify-center py-4 w-full">
          <div className="text-sm text-muted-foreground">Loading filters...</div>
        </div>
      ) : (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Region: {selectedRegion}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Select Region</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {regions.map((region) => (
                <DropdownMenuItem
                  key={region}
                  onClick={() => handleRegionChange(region)}
                  className="flex justify-between items-center"
                >
                  {region}
                  {selectedRegion === region && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Translator: {selectedTranslator}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Select Translator</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {translators.map((translator) => (
                <DropdownMenuItem
                  key={translator}
                  onClick={() => handleTranslatorChange(translator)}
                  className="flex justify-between items-center"
                >
                  {translator}
                  {selectedTranslator === translator && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Genre: {selectedGenre}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Select Genre</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {genres.map((genre) => (
                <DropdownMenuItem
                  key={genre}
                  onClick={() => handleGenreChange(genre)}
                  className="flex justify-between items-center"
                >
                  {genre}
                  {selectedGenre === genre && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  )
}

