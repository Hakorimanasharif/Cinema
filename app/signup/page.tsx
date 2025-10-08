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

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // In a real app, you would register with a backend
      // For demo purposes, we'll just redirect to home
      router.push("/")
    }
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
        <Link href="/login" className="text-white hover:text-red-500 transition-colors">
          Sign In
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 md:p-8 bg-black/75 rounded-lg shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Sign Up</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  className={`bg-gray-800/50 border-gray-700 h-12 text-base ${errors.firstName ? "border-red-500" : ""}`}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <div className="space-y-1">
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Last name"
                  className={`bg-gray-800/50 border-gray-700 h-12 text-base ${errors.lastName ? "border-red-500" : ""}`}
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                className={`bg-gray-800/50 border-gray-700 h-12 text-base ${errors.email ? "border-red-500" : ""}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`bg-gray-800/50 border-gray-700 h-12 text-base pr-10 ${errors.password ? "border-red-500" : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-1">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                className={`bg-gray-800/50 border-gray-700 h-12 text-base ${errors.confirmPassword ? "border-red-500" : ""}`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                className="mt-1 rounded bg-gray-800 border-gray-700"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <div>
                <Label htmlFor="agreeTerms" className="text-sm text-gray-400">
                  I agree to the{" "}
                  <Link href="/terms" className="text-red-500 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-red-500 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
                {errors.agreeTerms && <p className="text-xs text-red-500">{errors.agreeTerms}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 h-12 text-base">
              Sign Up
            </Button>
          </form>

          <div className="mt-8">
            <p className="text-gray-400 text-base">
              Already have an account?{" "}
              <Link href="/login" className="text-white hover:underline">
                Sign in now
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

