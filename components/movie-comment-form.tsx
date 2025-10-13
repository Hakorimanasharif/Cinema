"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Send, Star, User, ThumbsUp, MessageCircle } from "lucide-react"
import LoadingSpinner from "./loading-spinner"

interface MovieCommentFormProps {
  onCommentSubmit: (text: string, username: string) => void
  moviePoster?: string
}

export default function MovieCommentForm({ 
  onCommentSubmit, 
  moviePoster = "https://images.unsplash.com/photo-1489599809505-7c8e1c8bfc26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
}: MovieCommentFormProps) {
  const [comment, setComment] = useState("")
  const [username, setUsername] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasBadWord = comment.toLowerCase().includes('website')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim() || !username.trim() || hasBadWord) return

    setIsSubmitting(true)

    // Submit the comment
    onCommentSubmit(comment, username)

    // Reset form
    setComment("")
    setUsername("")
    setIsSubmitting(false)
  }

  return (
    <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl group">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform group-hover:scale-105 transition-transform duration-700"
        style={{ backgroundImage: `url(${moviePoster})` }}
      />
      
      {/* Dark Overlay with Netflix-style Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/60" />
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/60" />
      
      {/* Red Accent Glow */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-60" />

      <div className="relative z-10 p-8">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-red-600 to-red-800 rounded-xl shadow-lg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Join the Discussion
            </h3>
            <p className="text-gray-300 text-sm mt-1">
              Share your thoughts about this movie
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors duration-300">
              <User className="h-5 w-5" />
            </div>
            <Input
              placeholder="Your display name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-black/40 border-gray-600/50 pl-12 py-6 text-lg border-2 focus:border-red-500 focus:bg-black/60 transition-all duration-300 backdrop-blur-xl text-white placeholder-gray-400 rounded-xl"
              required
            />
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-400 group-focus-within:w-full transition-all duration-500" />
          </div>

          {/* Comment Textarea */}
          <div className="relative group">
            <Textarea
              placeholder="What did you think of this movie? Share your review... 🎬"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-black/40 border-gray-600/50 py-6 px-4 text-lg border-2 focus:border-red-500 focus:bg-black/60 transition-all duration-300 min-h-[160px] backdrop-blur-xl text-white placeholder-gray-400 rounded-xl resize-none"
              required
              maxLength={500}
            />
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-400 group-focus-within:w-full transition-all duration-500" />
            
            {/* Character Count */}
            <div className={`absolute bottom-3 right-3 text-sm transition-colors duration-300 ${
              comment.length > 400 ? 'text-yellow-400' : 'text-gray-400'
            }`}>
              {comment.length}/500
            </div>
          </div>

          {/* Bad Word Warning */}
          {hasBadWord && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              Comment contains prohibited content ("website")
            </div>
          )}

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-700/50 rounded-full h-2 overflow-hidden backdrop-blur-sm">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  comment.length > 400 ? 'bg-yellow-500' : 'bg-gradient-to-r from-red-600 to-red-400'
                }`}
                style={{ width: `${Math.min((comment.length / 500) * 100, 100)}%` }}
              />
            </div>
            <span className={`text-sm font-medium min-w-[80px] text-right ${
              comment.length > 400 ? 'text-yellow-400' : 'text-gray-300'
            }`}>
              {500 - comment.length} left
            </span>
          </div>

          {/* Submit Section */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-lg border border-gray-700/50">
                <ThumbsUp className="h-4 w-4" />
                <span className="text-sm">Be respectful</span>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={!comment.trim() || !username.trim() || isSubmitting || hasBadWord}
              className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none group/btn"
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              
              {isSubmitting ? (
                <div className="flex items-center gap-3 relative z-10">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Posting Review...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 relative z-10">
                  <span>Post Review</span>
                  <Send className="h-5 w-5" />
                </div>
              )}
            </Button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Your review will be visible to other movie enthusiasts
          </p>
        </div>
      </div>

      {/* Ambient Light Effects */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-red-400/5 rounded-full blur-3xl" />
    </div>
  )
}