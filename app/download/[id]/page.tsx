"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Download, ChevronLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getMovieById } from "@/lib/data"
import WhatsAppButton from "@/components/whatsapp-button"

interface DownloadPageProps {
  params: {
    id: string
  }
}

export default function DownloadPage({ params }: DownloadPageProps) {
  const movie = getMovieById(params.id)
  const [downloadState, setDownloadState] = useState<"idle" | "downloading" | "complete">("idle")
  const [progress, setProgress] = useState(0)

  if (!movie) {
    notFound()
  }

  const handleDownload = (quality: string) => {
    setDownloadState("downloading")

    // Simulate download progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setDownloadState("complete")

          // Create a download link for the sample video
          const link = document.createElement("a")
          link.href = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          link.download = `${movie.title.replace(/\s+/g, "_")}_${quality}.mp4`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          return 100
        }
        return prev + 5
      })
    }, 300)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header/Navigation */}
      <header className="flex items-center justify-between p-4 bg-black/90 border-b border-gray-800">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl font-bold text-red-600">Cinemax</h1>
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
            <Link href="/sports" className="text-sm hover:text-red-500 transition-colors duration-200">
              Sports
            </Link>
            <Link href="/premium" className="text-sm hover:text-red-500 transition-colors duration-200">
              Premium
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href={`/movie/${movie.id}`}>
            <Button variant="ghost" size="sm" className="p-0 h-auto">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Movie
            </Button>
          </Link>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                <Image
                  src={movie.id === "25" ? "/images/fast-x.jpg" : movie.posterImage || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <span>{movie.year}</span>
                <span>{movie.duration}</span>
                <span>{movie.rating}</span>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Download Options</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                    <div>
                      <p className="font-medium">HD Quality (1080p)</p>
                      <p className="text-sm text-gray-400">File size: 2.1 GB</p>
                    </div>
                    {downloadState === "idle" ? (
                      <Button onClick={() => handleDownload("1080p")} className="bg-red-600 hover:bg-red-700">
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                    ) : downloadState === "downloading" ? (
                      <div className="w-[200px]">
                        <Progress value={progress} className="h-2 mb-1" />
                        <p className="text-xs text-right">{progress}%</p>
                      </div>
                    ) : (
                      <Button disabled className="bg-green-600">
                        <Check className="mr-2 h-4 w-4" /> Downloaded
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                    <div>
                      <p className="font-medium">Standard Quality (720p)</p>
                      <p className="text-sm text-gray-400">File size: 1.3 GB</p>
                    </div>
                    <Button variant="outline" onClick={() => handleDownload("720p")}>
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md">
                    <div>
                      <p className="font-medium">Low Quality (480p)</p>
                      <p className="text-sm text-gray-400">File size: 700 MB</p>
                    </div>
                    <Button variant="outline" onClick={() => handleDownload("480p")}>
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Download Information</h2>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                  <li>Downloads are for offline viewing only</li>
                  <li>Downloaded content expires after 30 days</li>
                  <li>Content can be watched on up to 2 devices</li>
                  <li>By downloading, you agree to our Terms of Service</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/90 border-t border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-400">© 2025 Cinemax. All rights reserved.</p>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  )
}

