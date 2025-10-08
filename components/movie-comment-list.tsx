"use client"

import { useState } from "react"
import Image from "next/image"
import { ThumbsUp, ThumbsDown, Flag } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export interface Comment {
  _id: string
  username: string
  text: string
  createdAt: string
}

interface MovieCommentListProps {
  comments: Comment[]
}

export default function MovieCommentList({ comments }: MovieCommentListProps) {
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  return (
    <div className="space-y-6">
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="border-b border-gray-800 pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{comment.username}</h4>
                  <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-gray-300">{comment.text}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

