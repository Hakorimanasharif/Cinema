// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SettingsProvider } from "@/components/settings-context"
import { DynamicHead } from "@/components/dynamic-head"
import ScrollToTopButton from "@/components/scroll-to-top-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Agasobanuye - Watch Kinyarwanda Movies Online | Translated Movies in Rwanda",
  description: "Stream high-quality translated movies in Kinyarwanda on Agasobanuye. Enjoy Kinyarwanda movies online, translated films in Rwanda, and the best collection of Rwandan cinema.",
  keywords: "Kinyarwanda movies online, translated movies in Rwanda, Agasobanuye movies, Rwandan cinema, watch movies online Rwanda, Kinyarwanda films",
  authors: [{ name: "Agasobanuye" }],
  robots: "index, follow",
  openGraph: {
    title: "Agasobanuye - Watch Kinyarwanda Movies Online",
    description: "Stream high-quality translated movies in Kinyarwanda. Enjoy the best collection of Rwandan cinema and translated films.",
    url: "https://ciinemax.netlify.app",
    siteName: "Agasobanuye",
    images: [
      {
        url: "/placeholder.svg",
        width: 1200,
        height: 630,
        alt: "Agasobanuye - Kinyarwanda Movies Streaming Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agasobanuye - Watch Kinyarwanda Movies Online",
    description: "Stream high-quality translated movies in Kinyarwanda. Enjoy the best collection of Rwandan cinema and translated films.",
    images: ["/placeholder.svg"],
  },
  alternates: {
    canonical: "https://ciinemax.netlify.app",
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
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="google01d1931b39278409.html" />
        {/* Fallback favicon links for extra safety */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <SettingsProvider>
          <DynamicHead />
          {children}
          <ScrollToTopButton />
        </SettingsProvider>
      </body>
    </html>
  )
}
