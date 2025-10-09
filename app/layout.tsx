// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SettingsProvider } from "@/components/settings-context"
import { DynamicHead } from "@/components/dynamic-head"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cinemax - Stream Movies, TV Shows & Sports",
  description: "Cinemax is your ultimate online streaming platform where you can watch the latest movies, trending TV shows, and thrilling snlive sports — all in one place. Enjoy high-quality entertainment with smooth playback, agasobanuye (translated/subtitled) versions for better understanding, and exclusive access to both local and international content. Whether you love action, romance, comedy, drama, or live matches, Cinemax gives you the freedom to watch anytime, anywhere, and on any device. Experience cinema at its best — beautifully organized, fast, and made for true movie lovers.",

  verification: {
    google: "google01d1931b39278409",
  },
  icons: {
    icon: "https://i.pinimg.com/736x/03/81/12/0381120e8aa289654b67429b9f7165b9.jpg",          // main favicon (place this file in the public folder)
    shortcut: "https://i.pinimg.com/736x/03/81/12/0381120e8aa289654b67429b9f7165b9.jpg",      // browser shortcut icon
    apple: "https://i.pinimg.com/736x/03/81/12/0381120e8aa289654b67429b9f7165b9.jpg" // optional for Apple devices
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Fallback favicon links for extra safety */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <SettingsProvider>
          <DynamicHead />
          {children}
        </SettingsProvider>
      </body>
    </html>
  )
}
