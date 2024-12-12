"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Send } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Message = {
  id: number
  content: string
  sender: "user" | "other"
  timestamp: Date
}

export function Messages() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hey there! How can I help you with your YouTube channel?",
      sender: "other",
      timestamp: new Date(),
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          content: newMessage,
          sender: "user",
          timestamp: new Date(),
        },
      ])
      setNewMessage("")
    }
  }

  return (
    <Card className="w-full h-[calc(100vh-2rem)]">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                message.sender === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <div className="flex items-center gap-2">
                {message.sender === "other" && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                )}
                <p>{message.content}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {format(message.timestamp, "HH:mm")}
              </span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="Type your message here."
            className="flex-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

