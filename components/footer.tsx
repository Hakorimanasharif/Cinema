"use client"

import { useSettings } from "./settings-context"
import { Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  const { settings } = useSettings()
  return (
    <footer className="bg-black/90 border-t border-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">TV</h3>
            <ul className="space-y-2">
              <li>
                <a href="/series" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Popular Shows
                </a>
              </li>
              <li>
                <a href="/series" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  New Episodes
                </a>
              </li>
              <li>
                <a href="/series" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  TV Schedule
                </a>
              </li>
              <li>
                <a href="/premium" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Premium
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Movies</h3>
            <ul className="space-y-2">
              <li>
                <a href="/movie" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Popular Movies
                </a>
              </li>
              <li>
                <a href="/movie" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  New Releases
                </a>
              </li>
              <li>
                <a
                  href="/category/animation"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Animation
                </a>
              </li>
              <li>
                <a
                  href="/category/rwandan"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Rwandan Movies
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/support/faq"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/support/contact"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
              {settings.contactEmail && (
                <li>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    Email: {settings.contactEmail}
                  </a>
                </li>
              )}
              <li>
                <a
                  href="/support/devices"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Devices
                </a>
              </li>
              <li>
                <a
                  href="/support/terms"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400 mb-4">© {new Date().getFullYear()} {settings.siteName || "Cinemax"}. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

