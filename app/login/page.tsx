"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would authenticate with a backend
    // For demo purposes, we'll just redirect to home
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://i.pinimg.com/474x/9a/14/a2/9a14a22febd5e2fe157d418d3bb7294b.jpg"
          alt="Background"
          fill
          className="object-cover hidden md:block"
          priority
        />
        <Image
          src="https://i.pinimg.com/474x/29/c7/fb/29c7fbe8b3599a0c08942ebcedda0bf7.jpg"
          alt="Background Mobile"
          fill
          className="object-cover md:hidden"
          priority
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-red-600">Cinemax</h1>
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 md:p-8 bg-black/75 rounded-lg shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Sign In</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email or phone number"
                required
                className="bg-gray-800/50 border-gray-700 h-12 text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="bg-gray-800/50 border-gray-700 h-12 text-base pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 h-12 text-base">
              Sign In
            </Button>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded bg-gray-800 border-gray-700"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <Label htmlFor="remember" className="text-sm text-gray-400">
                  Remember me
                </Label>
              </div>
              <Link href="#" className="text-sm text-gray-400 hover:underline">
                Need help?
              </Link>
            </div>
          </form>

          <div className="mt-8">
            <p className="text-gray-400 text-base">
              New to Cinemax?{" "}
              <Link href="/signup" className="text-white hover:underline">
                Sign up now
              </Link>
            </p>
            <p className="text-gray-500 text-xs mt-4">
              This page is protected by Google reCAPTCHA to ensure you're not a bot.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/75 py-4 px-4 text-center">
        <p className="text-sm text-gray-400">© 2025 Cinemax. All rights reserved.</p>
      </footer>
    </div>
  )
}

