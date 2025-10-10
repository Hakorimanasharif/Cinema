"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Send, Star, User } from "lucide-react"
import LoadingSpinner from "./loading-spinner"

interface MovieCommentFormProps {
  onCommentSubmit: (text: string, username: string) => void
}

export default function MovieCommentForm({ onCommentSubmit }: MovieCommentFormProps) {
  const [comment, setComment] = useState("")
  const [username, setUsername] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim() || !username.trim()) return

    setIsSubmitting(true)

    // Submit the comment
    onCommentSubmit(comment, username)

    // Reset form
    setComment("")
    setUsername("")
    setIsSubmitting(false)
  }

  return (
    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-600 rounded-lg">
          <Star className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Share Your Review
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <User className="h-5 w-5" />
          </div>
          <Input
            placeholder="Your display name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-800/60 border-gray-600 pl-12 py-6 text-lg border-2 focus:border-red-500/50 transition-all duration-300 backdrop-blur-sm"
            required
          />
        </div>

        <div className="relative">
          <Textarea
            placeholder="Share your cinematic experience... What did you love about this movie? ✨"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-gray-800/60 border-gray-600 py-6 px-4 text-lg border-2 focus:border-red-500/50 transition-all duration-300 min-h-[140px] backdrop-blur-sm resize-none"
            required
          />
          <div className="absolute bottom-3 right-3 text-sm text-gray-400">
            {comment.length}/500
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Join the conversation
          </div>
          
          <Button 
            type="submit" 
            disabled={!comment.trim() || !username.trim() || isSubmitting}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" color="white" />
                <span>Posting Review...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Post Review</span>
                <Send className="h-5 w-5" />
              </div>
            )}
          </Button>
        </div>
      </form>

      {/* Character count indicator */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className={`h-2 flex-1 bg-gray-700 rounded-full overflow-hidden ${comment.length > 400 ? 'animate-pulse' : ''}`}>
            <div 
              className={`h-full transition-all duration-500 ${
                comment.length > 400 ? 'bg-yellow-500' : 'bg-red-600'
              }`}
              style={{ width: `${Math.min((comment.length / 500) * 100, 100)}%` }}
            />
          </div>
          <span className={`text-xs ${comment.length > 400 ? 'text-yellow-500 font-semibold' : ''}`}>
            {500 - comment.length} chars left
          </span>
        </div>
      </div>
    </div>
  )
}