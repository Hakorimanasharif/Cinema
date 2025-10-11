"use client"

import { useState, useEffect } from "react"
import { MessageSquare } from "lucide-react"
import MovieCommentForm from "./movie-comment-form"
import MovieCommentList, { type Comment } from "./movie-comment-list"

interface MovieCommentsProps {
  movieId: string
  movieTitle: string
}

export default function MovieComments({ movieId, movieTitle }: MovieCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cinemax-8yem.onrender.com"

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/movies/${movieId}/comments`)
        const data = await res.json()
        if (res.ok) {
          setComments(data)
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchComments()
  }, [movieId, API_BASE])

  const handleCommentSubmit = async (text: string, username: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/movies/${movieId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, username }),
      })
      const data = await res.json()
      if (res.ok) {
        setComments([data, ...comments])
        setErrorMessage(null)
      } else {
        setErrorMessage(data.error || 'Failed to post comment')
      }
    } catch (error) {
      console.error('Failed to post comment:', error)
      setErrorMessage('Failed to post comment')
    }
  }

  if (loading) {
    return (
      <div className="mt-12 bg-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        <p>Loading comments...</p>
      </div>
    )
  }

  return (
    <div className="mt-12 max-w-2xl mx-auto bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <MessageSquare className="mr-2 h-6 w-6" />
        Comments
      </h2>

      {/* Comment form */}
      <MovieCommentForm onCommentSubmit={handleCommentSubmit} />

      {/* Error message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-600/20 border border-red-600 rounded-lg text-red-400">
          {errorMessage}
        </div>
      )}

      {/* Comments list */}
      <MovieCommentList comments={comments} />
    </div>
  )
}

