"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown, Flag, Send } from "lucide-react"

interface Comment {
  id: string
  user: {
    name: string
    avatar: string
  }
  text: string
  date: string
  likes: number
  dislikes: number
  isLiked?: boolean
  isDisliked?: boolean
}

// Sample comments data
const initialComments: Comment[] = [
  {
    id: "1",
    user: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    text: "This movie was amazing! The action scenes were incredible and the story kept me engaged throughout.",
    date: "2 days ago",
    likes: 24,
    dislikes: 2,
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    text: "I loved the cinematography and the acting was top-notch. Definitely one of my favorites this year!",
    date: "1 week ago",
    likes: 18,
    dislikes: 1,
  },
  {
    id: "3",
    user: {
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    text: "The plot had some holes, but overall it was entertaining. The special effects were really well done.",
    date: "2 weeks ago",
    likes: 7,
    dislikes: 3,
  },
]

export default function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        user: {
          name: "You",
          avatar: "/placeholder.svg?height=50&width=50",
        },
        text: newComment,
        date: "Just now",
        likes: 0,
        dislikes: 0,
      }

      setComments([comment, ...comments])
      setNewComment("")
      setIsSubmitting(false)
    }, 500)
  }

  const handleLike = (id: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === id) {
          if (comment.isLiked) {
            return { ...comment, likes: comment.likes - 1, isLiked: false }
          } else {
            // If it was disliked before, remove the dislike
            const dislikes = comment.isDisliked ? comment.dislikes - 1 : comment.dislikes
            return { ...comment, likes: comment.likes + 1, isLiked: true, dislikes, isDisliked: false }
          }
        }
        return comment
      }),
    )
  }

  const handleDislike = (id: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === id) {
          if (comment.isDisliked) {
            return { ...comment, dislikes: comment.dislikes - 1, isDisliked: false }
          } else {
            // If it was liked before, remove the like
            const likes = comment.isLiked ? comment.likes - 1 : comment.likes
            return { ...comment, dislikes: comment.dislikes + 1, isDisliked: true, likes, isLiked: false }
          }
        }
        return comment
      }),
    )
  }

  return (
    <div className="mt-12 bg-gray-900 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

      {/* Comment form */}
      <form onSubmit={handleCommentSubmit} className="mb-8">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="bg-gray-800 border-gray-700 mb-3 min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={!newComment.trim() || isSubmitting} className="bg-red-600 hover:bg-red-700">
            {isSubmitting ? "Posting..." : "Post Comment"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-800 pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-start gap-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={comment.user.avatar || "/placeholder.svg"}
                  alt={comment.user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{comment.user.name}</h4>
                  <span className="text-xs text-gray-400">{comment.date}</span>
                </div>
                <p className="text-gray-300 mb-3">{comment.text}</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className={`flex items-center gap-1 text-sm ${
                      comment.isLiked ? "text-blue-500" : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{comment.likes}</span>
                  </button>
                  <button
                    onClick={() => handleDislike(comment.id)}
                    className={`flex items-center gap-1 text-sm ${
                      comment.isDisliked ? "text-red-500" : "text-gray-400 hover:text-gray-300"
                    }`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>{comment.dislikes}</span>
                  </button>
                  <button className="text-gray-400 hover:text-gray-300 text-sm">
                    <Flag className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

