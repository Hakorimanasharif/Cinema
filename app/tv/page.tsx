import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CategoryRow from "@/components/category-row"

export default function TVPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      <main className="pt-16">
        {/* Hero Banner */}
        <section className="relative h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
          <Image src="/placeholder.svg?height=1080&width=1920" alt="TV Shows" fill className="object-cover" priority />
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

        {/* TV Show Categories */}
        <section className="px-4 py-8">
          <CategoryRow title="Popular TV Shows" category="popular" />
          <CategoryRow title="New Episodes" category="new" />
          <CategoryRow title="Drama Series" category="drama" />
          <CategoryRow title="Comedy Shows" category="comedy" />
          <CategoryRow title="Animated Series" category="animation" />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

