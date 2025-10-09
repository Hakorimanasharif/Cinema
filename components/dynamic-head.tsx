"use client"

import { useEffect } from "react"
import { useSettings } from "./settings-context"

export function DynamicHead() {
  const { settings } = useSettings()

  useEffect(() => {
    // Update document title
    if (settings.siteName) {
      document.title = settings.siteName
    }

    // Update favicon
    if (settings.favicon) {
      let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      if (!favicon) {
        favicon = document.createElement('link')
        favicon.rel = 'icon'
        document.head.appendChild(favicon)
      }
      favicon.href = settings.favicon
    }

    // Update meta description
    if (settings.siteDescription) {
      let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.name = 'description'
        document.head.appendChild(metaDesc)
      }
      metaDesc.content = settings.siteDescription
    }

    // Update meta keywords
    if (settings.metaKeywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta')
        metaKeywords.name = 'keywords'
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.content = settings.metaKeywords
    }

    // Update Open Graph image
    if (settings.ogImage) {
      let ogImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement
      if (!ogImage) {
        ogImage = document.createElement('meta')
        ogImage.setAttribute('property', 'og:image')
        document.head.appendChild(ogImage)
      }
      ogImage.content = settings.ogImage
    }

    // Update Open Graph title
    if (settings.siteName) {
      let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement
      if (!ogTitle) {
        ogTitle = document.createElement('meta')
        ogTitle.setAttribute('property', 'og:title')
        document.head.appendChild(ogTitle)
      }
      ogTitle.content = settings.siteName
    }

    // Update Open Graph description
    if (settings.siteDescription) {
      let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement
      if (!ogDesc) {
        ogDesc = document.createElement('meta')
        ogDesc.setAttribute('property', 'og:description')
        document.head.appendChild(ogDesc)
      }
      ogDesc.content = settings.siteDescription
    }

  }, [settings])

  return null
}
