import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X } from 'lucide-react'

interface Comment {
  id: string
  author: string
  content: string
  avatar: string
}

interface Task {
  id: string
  content: string
  priority: 'low' | 'medium' | 'high'
  description: string
  assignee: string
  comments: Comment[]
}

interface CardDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  card: Task | null
  onUpdate: (updatedCard: Task) => void
  onDelete: (cardId: string) => void
}

export function CardDetailsModal({ isOpen, onClose, card, onUpdate, onDelete }: CardDetailsModalProps) {
  const [editedCard, setEditedCard] = useState<Task | null>(card)
  const [newComment, setNewComment] = useState('')

  if (!editedCard) return null

  const handleUpdate = () => {
    if (editedCard) {
      onUpdate(editedCard)
      onClose()
    }
  }

  const handleDelete = () => {
    if (editedCard) {
      onDelete(editedCard.id)
      onClose()
    }
  }

  const addComment = () => {
    if (newComment.trim() !== '') {
      const updatedCard = {
        ...editedCard,
        comments: [
          ...editedCard.comments,
          {
            id: `comment-${Date.now()}`,
            author: 'Current User',
            content: newComment,
            avatar: '/placeholder.svg?height=40&width=40',
          },
        ],
      }
      setEditedCard(updatedCard)
      setNewComment('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Card Details</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="title"
              value={editedCard.content}
              onChange={(e) => setEditedCard({ ...editedCard, content: e.target.value })}
              className="col-span-3"
              aria-label="Card title"
            />
            <Select
              value={editedCard.priority}
              onValueChange={(value) => setEditedCard({ ...editedCard, priority: value as 'low' | 'medium' | 'high' })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="assignee"
              value={editedCard.assignee}
              onChange={(e) => setEditedCard({ ...editedCard, assignee: e.target.value })}
              className="col-span-4"
              placeholder="Assignee"
              aria-label="Assignee"
            />
          </div>
          <Textarea
            placeholder="Add a description..."
            value={editedCard.description}
            onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
            aria-label="Card description"
          />
          <div>
            <h4 className="mb-4 text-sm font-medium">Comments</h4>
            {editedCard.comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-4 mb-4">
                <Avatar>
                  <AvatarImage src={comment.avatar} alt={comment.author} />
                  <AvatarFallback>{comment.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{comment.author}</p>
                  <p className="text-sm text-gray-500">{comment.content}</p>
                </div>
              </div>
            ))}
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Current User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-2"
                  aria-label="New comment"
                />
                <Button onClick={addComment}>Add Comment</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleDelete}>Delete Card</Button>
          <Button onClick={handleUpdate}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

