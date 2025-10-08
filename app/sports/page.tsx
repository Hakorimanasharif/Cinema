import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import SearchBar from "@/components/search-bar"

export default function SportsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header/Navigation */}
      <header className="flex items-center justify-between p-4 bg-black/90 border-b border-gray-800">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl font-bold text-red-600">Cinemax</h1>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/tv" className="text-sm hover:text-red-500">
              TV
            </Link>
            <Link href="/movies" className="text-sm hover:text-red-500">
              Movies
            </Link>
            <Link href="/sports" className="text-sm text-red-500">
              Sports
            </Link>
            <Link href="/premium" className="text-sm hover:text-red-500">
              Premium
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <SearchBar />
          <Link href="/login" className="text-sm hover:text-red-500">
            Login
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Banner */}
        <section className="relative h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
          <Image src="/placeholder.svg?height=1080&width=1920" alt="Sports" fill className="object-cover" priority />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Live Sports</h1>
            <p className="text-sm md:text-base text-gray-300 mb-6 max-w-2xl">
              Watch your favorite sports live and on-demand. Never miss a game with our comprehensive sports coverage.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/sports/live">
                <Button size="lg" className="bg-red-600 hover:bg-red-700">
                  Watch Live
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Sports Categories */}
        <section className="px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Popular Sports</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <Link href="/sports/football" className="group">
              <div className="relative aspect-video overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105">
                <Image src="/placeholder.svg?height=400&width=600" alt="Football" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-xl font-bold">Football</h3>
                </div>
              </div>
            </Link>
            <Link href="/sports/basketball" className="group">
              <div className="relative aspect-video overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105">
                <Image src="/placeholder.svg?height=400&width=600" alt="Basketball" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-xl font-bold">Basketball</h3>
                </div>
              </div>
            </Link>
            <Link href="/sports/tennis" className="group">
              <div className="relative aspect-video overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105">
                <Image src="/placeholder.svg?height=400&width=600" alt="Tennis" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-xl font-bold">Tennis</h3>
                </div>
              </div>
            </Link>
            <Link href="/sports/formula1" className="group">
              <div className="relative aspect-video overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105">
                <Image src="/placeholder.svg?height=400&width=600" alt="Formula 1" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-xl font-bold">Formula 1</h3>
                </div>
              </div>
            </Link>
            <Link href="/sports/golf" className="group">
              <div className="relative aspect-video overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105">
                <Image src="/placeholder.svg?height=400&width=600" alt="Golf" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-xl font-bold">Golf</h3>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Live Now */}
        <section className="px-4 py-8 bg-gray-900">
          <h2 className="text-2xl font-bold mb-6">Live Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-black rounded-lg overflow-hidden">
              <div className="relative aspect-video">
                <Image src="/placeholder.svg?height=400&width=600" alt="Live Match" fill className="object-cover" />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">LIVE</div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1">Premier League: Arsenal vs Chelsea</h3>
                <p className="text-sm text-gray-400">Football • 45:22</p>
              </div>
            </div>
            <div className="bg-black rounded-lg overflow-hidden">
              <div className="relative aspect-video">
                <Image src="/placeholder.svg?height=400&width=600" alt="Live Match" fill className="object-cover" />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">LIVE</div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1">NBA: Lakers vs Warriors</h3>
                <p className="text-sm text-gray-400">Basketball • 1:15:07</p>
              </div>
            </div>
            <div className="bg-black rounded-lg overflow-hidden">
              <div className="relative aspect-video">
                <Image src="/placeholder.svg?height=400&width=600" alt="Live Match" fill className="object-cover" />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">LIVE</div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1">F1: Monaco Grand Prix</h3>
                <p className="text-sm text-gray-400">Formula 1 • 32:45</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black/90 border-t border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-400">© 2025 Cinemax. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

