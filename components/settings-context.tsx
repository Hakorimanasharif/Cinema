"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface WebsiteSettings {
  siteName?: string
  siteDescription?: string
  logo?: string
  favicon?: string
  primaryColor?: string
  secondaryColor?: string
  maintenanceMode?: boolean
  allowRegistration?: boolean
  requireEmailVerification?: boolean
  contactEmail?: string
  googleAnalytics?: string
  facebookPixel?: string
  metaKeywords?: string
  ogImage?: string
  socialFacebook?: string
  socialTwitter?: string
  socialInstagram?: string
  socialYouTube?: string
  socialTikTok?: string
}

interface SettingsContextType {
  settings: WebsiteSettings
  refreshSettings: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<WebsiteSettings>({})
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cinemax-8yem.onrender.com"

  const refreshSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/settings`)
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    }
  }

  useEffect(() => {
    refreshSettings()
  }, [])

  useEffect(() => {
    const handleFocus = () => {
      refreshSettings()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
