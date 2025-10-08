"use client"

import { useState } from "react"
import Image from "next/image"
import { ThumbsUp, ThumbsDown, Flag } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export interface Comment {
  id: string
  user: {
    name: string
    avatar: string
  }
  text: string
  date: Date
  likes: number
  dislikes: number
  isLiked?: boolean
  isDisliked?: boolean
  replies?: Comment[]
}

interface MovieCommentListProps {
  comments: Comment[]
  onLike: (id: string) => void
  onDislike: (id: string) => void
}

export default function MovieCommentList({ comments, onLike, onDislike }: MovieCommentListProps) {
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({})

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }))
  }

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div
      key={comment.id}
      className={`${isReply ? "ml-12 mt-4" : "border-b border-gray-800 pb-6 last:border-b-0 last:pb-0"}`}
    >
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
            <span className="text-xs text-gray-400">{formatDate(comment.date)}</span>
          </div>
          <p className="text-gray-300 mb-3">{comment.text}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 text-sm ${
                comment.isLiked ? "text-blue-500" : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{comment.likes}</span>
            </button>
            <button
              onClick={() => onDislike(comment.id)}
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
            {!isReply && comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => toggleReplies(comment.id)}
                className="text-gray-400 hover:text-gray-300 text-sm ml-auto"
              >
                {expandedReplies[comment.id] ? "Hide Replies" : `Show Replies (${comment.replies.length})`}
              </button>
            )}
          </div>
        </div>
      </div>

      {!isReply && comment.replies && expandedReplies[comment.id] && (
        <div className="mt-4 space-y-4">{comment.replies.map((reply) => renderComment(reply, true))}</div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        comments.map((comment) => renderComment(comment))
      )}
    </div>
  )
}

