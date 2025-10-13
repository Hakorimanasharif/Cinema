"use client"

import { useState, useEffect } from "react"
import { MessageSquare, ChevronLeft, ChevronRight } from "lucide-react"
import MovieCommentForm from "./movie-comment-form"
import MovieCommentList, { type Comment } from "./movie-comment-list"

interface MovieCommentsProps {
  movieId: string
  movieTitle: string
  moviePoster?: string
}

const COMMENTS_PER_PAGE = 5

export default function MovieComments({ movieId, movieTitle, moviePoster }: MovieCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  
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
        // Reset to first page when new comment is added
        setCurrentPage(1)
      } else {
        setErrorMessage(data.error || 'Failed to post comment')
      }
    } catch (error) {
      console.error('Failed to post comment:', error)
      setErrorMessage('Failed to post comment')
    }
  }

  // Calculate pagination values
  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE)
  const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE
  const currentComments = comments.slice(startIndex, startIndex + COMMENTS_PER_PAGE)

  // Handle page changes
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (loading) {
    return (
      <div className="mt-12 max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-600 rounded-lg">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Community Reviews
            </h2>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-gray-400">Loading comments...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      {/* Main Container */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
        {/* Background with Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-sm" />
        
        {/* Red Accent Top Border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        
        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-red-600 to-red-800 rounded-xl shadow-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Community Reviews
                </h2>
                <p className="text-gray-300 text-sm mt-1">
                  Join the conversation about {movieTitle}
                </p>
              </div>
            </div>

            {/* Comments Count Badge */}
            <div className="bg-black/40 border border-gray-600/50 rounded-lg px-4 py-2 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{comments.length}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Total Reviews</div>
              </div>
            </div>
          </div>

          {/* Comment Form */}
          <div className="mb-8">
            <MovieCommentForm onCommentSubmit={handleCommentSubmit} moviePoster={moviePoster} />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-xl text-red-400 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                {errorMessage}
              </div>
            </div>
          )}

          {/* Comments List with Pagination */}
          <div className="space-y-6">
            {/* Comments List */}
            <MovieCommentList comments={currentComments} />

            {/* Pagination Controls */}
            {comments.length > COMMENTS_PER_PAGE && (
              <div className="flex items-center justify-between pt-6 border-t border-gray-700/50">
                {/* Page Info */}
                <div className="text-sm text-gray-400">
                  Showing {startIndex + 1}-{Math.min(startIndex + COMMENTS_PER_PAGE, comments.length)} of {comments.length} reviews
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 border border-gray-600/50 text-gray-300 disabled:text-gray-600 disabled:border-gray-700/30 hover:bg-red-600/20 hover:border-red-500/50 transition-all duration-300 disabled:hover:bg-black/40 backdrop-blur-sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 rounded-lg border transition-all duration-300 backdrop-blur-sm ${
                          currentPage === page
                            ? 'bg-red-600 border-red-500 text-white shadow-lg'
                            : 'bg-black/40 border-gray-600/50 text-gray-300 hover:bg-red-600/20 hover:border-red-500/50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 border border-gray-600/50 text-gray-300 disabled:text-gray-600 disabled:border-gray-700/30 hover:bg-red-600/20 hover:border-red-500/50 transition-all duration-300 disabled:hover:bg-black/40 backdrop-blur-sm"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {comments.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-black/20 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
                  <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Be the first to share your thoughts about {movieTitle}. Your review will help other movie enthusiasts!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ambient Light Effects */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-red-400/5 rounded-full blur-3xl" />
      </div>
    </div>
  )
}