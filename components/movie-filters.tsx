"use client"

import { useState } from "react"
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
  const router = useRouter()

  const regions = ["All", "American", "Indian", "Korean", "Nigerian", "Rwandan", "European", "Chinese"]
  const translators = ["All", "Rocky", "Sankara", "Junior Giti", "Savimbi", "Official"]
  const genres = ["All", "Action", "Comedy", "Drama", "Horror", "Animation", "Romance", "Sci-Fi", "Thriller"]

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
    </div>
  )
}

