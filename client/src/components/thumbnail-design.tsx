"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Img } from "react-image";

interface ThumbnailDesignProps {
  onComplete: (data: ThumbnailDesignData) => void
}

interface ThumbnailDesignData {
  selectedStyle: string
  youtubeUrl?: string
}

interface ThumbnailStyle {
  id: string
  name: string
  image: string
}

export function ThumbnailDesign({ onComplete }: ThumbnailDesignProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>("")
  const [youtubeUrl, setYoutubeUrl] = useState<string>("")

  // Dummy data for thumbnail styles
  const thumbnailStyles: ThumbnailStyle[] = [
    { id: "1", name: "Minimalist", image: "/placeholder.svg?height=180&width=320" },
    { id: "2", name: "Bold Text", image: "/placeholder.svg?height=180&width=320" },
    { id: "3", name: "Illustrated", image: "/placeholder.svg?height=180&width=320" },
    { id: "4", name: "Photo-based", image: "/placeholder.svg?height=180&width=320" },
    { id: "5", name: "Infographic", image: "/placeholder.svg?height=180&width=320" },
    { id: "6", name: "Character-focused", image: "/placeholder.svg?height=180&width=320" },
  ]

  const handleStyleSelection = (styleId: string) => {
    setSelectedStyle(styleId)
  }

  const handleYoutubeUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically fetch the thumbnail from the YouTube URL
    // For this example, we'll just store the URL
  }

  const handleComplete = () => {
    onComplete({
      selectedStyle,
      ...(youtubeUrl && { youtubeUrl }),
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Thumbnail Design</h2>

      <Card>
        <CardHeader>
          <CardTitle>Select Thumbnail Style</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {thumbnailStyles.map((style) => (
              <div
                key={style.id}
                className={`cursor-pointer border-2 rounded-lg p-2 ${
                  selectedStyle === style.id ? "border-primary" : "border-transparent"
                }`}
                onClick={() => handleStyleSelection(style.id)}
              >
                <Img
                  src={style.image}
                  alt={style.name}
                  width={320}
                  height={180}
                  className="rounded-md mb-2"
                />
                <p className="text-center font-medium">{style.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Or Select from YouTube</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleYoutubeUrlSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="youtube-url">YouTube Video URL</Label>
              <Input
                id="youtube-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
            </div>
            <Button type="submit">Fetch Thumbnail</Button>
          </form>
          {youtubeUrl && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
              <Img
                src={`https://img.youtube.com/vi/${youtubeUrl.split("v=")[1]}/0.jpg`}
                alt="YouTube Thumbnail"
                width={320}
                height={180}
                className="rounded-md"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleComplete} size="lg" disabled={!selectedStyle && !youtubeUrl}>
          Next
        </Button>
      </div>
    </div>
  )
}

