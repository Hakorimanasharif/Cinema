import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SettingsProvider } from "@/components/settings-context"
import { DynamicHead } from "@/components/dynamic-head"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cinemax - Stream Movies, TV Shows & Sports",
  description: "Watch the latest movies, TV shows, and live sports on Cinemax",
  verification: {
    google: "google01d1931b39278409",
  },

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SettingsProvider>
          <DynamicHead />
          {children}
        </SettingsProvider>
      </body>
    </html>
  )
}



import './globals.css'