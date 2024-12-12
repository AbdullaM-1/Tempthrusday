"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Img } from "react-image";


interface ScreenwritingProps {
  onComplete: (data: ScreenwritingData) => void
}

interface ScreenwritingData {
  category: string
  selectedSample: string
}

interface VideoRecord {
  id: string
  title: string
  thumbnail: string
}

interface WritingSample {
  id: string
  title: string
  content: string
  category: string
}

export function Screenwriting({ onComplete }: ScreenwritingProps) {
  const [category, setCategory] = useState<string>("")
  const [selectedSample, setSelectedSample] = useState<string>("")

  // Dummy data for previous video records
  const videoRecords: VideoRecord[] = [
    { id: "1", title: "How to Make Pizza", thumbnail: "/placeholder.svg?height=90&width=160" },
    { id: "2", title: "10 Minute Workout", thumbnail: "/placeholder.svg?height=90&width=160" },
    { id: "3", title: "DIY Home Decor", thumbnail: "/placeholder.svg?height=90&width=160" },
  ]

  // Dummy data for writing samples
  const writingSamples: WritingSample[] = [
    { id: "1", title: "Dramatic Monologue", content: "Example of a dramatic monologue...", category: "drama" },
    { id: "2", title: "Comedy Sketch", content: "Example of a comedy sketch...", category: "comedy" },
    { id: "3", title: "Documentary Narration", content: "Example of documentary narration...", category: "documentary" },
    { id: "4", title: "Commercial Script", content: "Example of a commercial script...", category: "commercial" },
  ]

  const handleComplete = () => {
    if (category && selectedSample) {
      onComplete({ category, selectedSample })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Screenwriting Requirements</h2>

      <Card>
        <CardHeader>
          <CardTitle>Select Writing Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="drama">Drama</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="documentary">Documentary</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Previous Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoRecords.map((video) => (
              <div key={video.id} className="flex items-center space-x-4">
                <Img
                  src={video.thumbnail}
                  alt={video.title}
                  width={160}
                  height={90}
                  className="rounded-md"
                />
                <span className="text-sm font-medium">{video.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {category && (
        <Card>
          <CardHeader>
            <CardTitle>Writing Samples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {writingSamples
                .filter((sample) => sample.category === category)
                .map((sample) => (
                  <div key={sample.id} className="flex items-center space-x-4">
                    <input
                      type="radio"
                      id={sample.id}
                      name="writingSample"
                      value={sample.id}
                      checked={selectedSample === sample.id}
                      onChange={() => setSelectedSample(sample.id)}
                      className="form-radio"
                    />
                    <label htmlFor={sample.id} className="flex-1">
                      <h3 className="font-medium">{sample.title}</h3>
                      <p className="text-sm text-muted-foreground">{sample.content.substring(0, 100)}...</p>
                    </label>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={handleComplete} size="lg" disabled={!category || !selectedSample}>
          Complete Order
        </Button>
      </div>
    </div>
  )
}

