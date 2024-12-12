import React from 'react'
import { Slider } from "@/components/ui/slider"

interface CustomProgressBarProps {
  currentTime: number
  duration: number
  commentTimestamps: number[]
  onSeek: (time: number) => void
}

export function CustomProgressBar({ currentTime, duration, commentTimestamps, onSeek }: CustomProgressBarProps) {
  const handleSeek = (value: number[]) => {
    onSeek(value[0])
  }

  return (
    <div className="relative w-full h-6">
      <Slider
        value={[currentTime]}
        min={0}
        max={duration}
        step={0.1}
        onValueChange={handleSeek}
        className="absolute inset-0"
      />
      {commentTimestamps.map((timestamp, index) => (
        <div
          key={index}
          className="absolute top-0 w-1 h-full bg-primary"
          style={{ left: `${(timestamp / duration) * 100}%` }}
        />
      ))}
    </div>
  )
}

