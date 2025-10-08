"use client"

import { useState } from "react"
import MovieCommentForm from "./movie-comment-form"
import MovieCommentList, { type Comment } from "./movie-comment-list"

// Sample comments data
const initialComments: Comment[] = [
  {
    id: "1",
    user: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    text: "This movie was amazing! The action scenes were incredible and the story kept me engaged throughout.",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    likes: 24,
    dislikes: 2,
    replies: [
      {
        id: "1-1",
        user: {
          name: "Sarah Johnson",
          avatar: "/placeholder.svg?height=50&width=50",
        },
        text: "I agree! The cinematography was also top-notch.",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        likes: 5,
        dislikes: 0,
      },
    ],
  },
  {
    id: "2",
    user: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    text: "I loved the cinematography and the acting was top-notch. Definitely one of my favorites this year!",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
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
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    likes: 7,
    dislikes: 3,
  },
]

interface MovieCommentsProps {
  movieId: string
  movieTitle: string
}

export default function MovieComments({ movieId, movieTitle }: MovieCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)

  const handleCommentSubmit = (text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      user: {
        name: "You",
        avatar: "/placeholder.svg?height=50&width=50",
      },
      text,
      date: new Date(),
      likes: 0,
      dislikes: 0,
    }

    setComments([newComment, ...comments])
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

        // Check if the comment is in replies
        if (comment.replies) {
          const updatedReplies = comment.replies.map((reply) => {
            if (reply.id === id) {
              if (reply.isLiked) {
                return { ...reply, likes: reply.likes - 1, isLiked: false }
              } else {
                const dislikes = reply.isDisliked ? reply.dislikes - 1 : reply.dislikes
                return { ...reply, likes: reply.likes + 1, isLiked: true, dislikes, isDisliked: false }
              }
            }
            return reply
          })
          return { ...comment, replies: updatedReplies }
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

        // Check if the comment is in replies
        if (comment.replies) {
          const updatedReplies = comment.replies.map((reply) => {
            if (reply.id === id) {
              if (reply.isDisliked) {
                return { ...reply, dislikes: reply.dislikes - 1, isDisliked: false }
              } else {
                const likes = reply.isLiked ? reply.likes - 1 : reply.likes
                return { ...reply, dislikes: reply.dislikes + 1, isDisliked: true, likes, isLiked: false }
              }
            }
            return reply
          })
          return { ...comment, replies: updatedReplies }
        }

        return comment
      }),
    )
  }

  return (
    <div className="mt-12 bg-gray-900 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

      {/* Comment form */}
      <MovieCommentForm onCommentSubmit={handleCommentSubmit} />

      {/* Comments list */}
      <MovieCommentList comments={comments} onLike={handleLike} onDislike={handleDislike} />
    </div>
  )
}

