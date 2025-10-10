"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Phone } from "lucide-react"
import SearchBar from "@/components/search-bar"

import { useSettings } from "./settings-context"

export default function Header() {
  const { settings } = useSettings()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isPlayPage = pathname.startsWith("/play/")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md shadow-md py-2"
          : "bg-gradient-to-b from-black/80 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl font-bold text-red-600">{settings.siteName || "Cinemax"}</h1>
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
            <Link href="/category/rwandan" className="text-sm hover:text-red-500 transition-colors duration-200">
              Rwandan
            </Link>
          </nav>
        </div>

        <div
          className={`flex items-center gap-4 ${isPlayPage && isScrolled ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        >
          <SearchBar />

          <a
            href="https://wa.me/0798388890"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-full transition-all duration-300 text-sm"
          >
            <Phone size={16} />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Login removed per request */}

          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md absolute top-full left-0 right-0 border-t border-gray-800">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              href="/tv"
              className="text-sm hover:text-red-500 transition-colors duration-200 p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              TV
            </Link>
            <Link
              href="/movies"
              className="text-sm hover:text-red-500 transition-colors duration-200 p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Movies
            </Link>
            <Link
              href="/category/animation"
              className="text-sm hover:text-red-500 transition-colors duration-200 p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Animation
            </Link>
            <Link
              href="/category/rwandan"
              className="text-sm hover:text-red-500 transition-colors duration-200 p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Rwandan
            </Link>
            {/* Login removed per request */}
          </nav>
        </div>
      )}
    </header>
  )
}

