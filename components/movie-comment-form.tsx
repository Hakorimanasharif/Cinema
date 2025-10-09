"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
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
    <form onSubmit={handleSubmit} className="mb-8">
      <h3 className="text-lg font-semibold mb-2">Add Your Comment</h3>
      <Input
        placeholder="Your display name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="bg-gray-800 border-gray-700 mb-3"
        required
      />
      <Textarea
        placeholder="Share your thoughts about this movie..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="bg-gray-800 border-gray-700 mb-3 min-h-[100px]"
        required
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!comment.trim() || isSubmitting} className="bg-red-600 hover:bg-red-700">
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" color="white" className="mr-2" />
              Posting...
            </>
          ) : (
            <>
              Post Comment
              <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

