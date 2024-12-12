import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatTime } from "../../utils/FormatTime"
import { CustomProgressBar } from '../../components/custom-progress-bar'
import { DrawingCanvas } from '../../components/drawing-canvas.tsx'
import { Play, Pause, RotateCcw, Clock, Pencil, Eraser, Maximize, Minimize } from 'lucide-react'

interface Reply {
  id: number
  text: string
}

interface Comment {
  id: number
  text: string
  timestamp: number
  drawing?: string
  replies: Reply[]
}

export default function VideoPlayerWithComments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [timeFormat, setTimeFormat] = useState<'normal' | 'remaining'>('normal')
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  const [currentDrawing, setCurrentDrawing] = useState<string | null>(null)
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 })
  const [drawingColor, setDrawingColor] = useState('#FF0000')
  const [brushSize, setBrushSize] = useState(2)
  const [drawingMode, setDrawingMode] = useState<'freehand' | 'circle' | 'arrow'>('freehand')
  const [isCommentingWithDrawing, setIsCommentingWithDrawing] = useState(false)
  const [commentDrawingTimestamp, setCommentDrawingTimestamp] = useState<number | null>(null)
  const [activeCommentDrawing, setActiveCommentDrawing] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTimeAndDrawing = () => {
      setCurrentTime(video.currentTime)
      updateActiveCommentDrawing(video.currentTime)
    }

    const updateInterval = setInterval(updateTimeAndDrawing, 100) // Check every 100ms

    const updateVideoSize = () => {
      setVideoSize({
        width: video.videoWidth,
        height: video.videoHeight
      })
    }

    video.addEventListener('loadedmetadata', () => {
      setDuration(video.duration)
      updateVideoSize()
    })
    video.addEventListener('play', updateTimeAndDrawing)
    video.addEventListener('pause', updateTimeAndDrawing)
    video.addEventListener('seeked', updateTimeAndDrawing)
    video.addEventListener('ended', () => setIsPlaying(false))
    window.addEventListener('resize', updateVideoSize)

    return () => {
      clearInterval(updateInterval)
      video.removeEventListener('loadedmetadata', () => {
        setDuration(video.duration)
        updateVideoSize()
      })
      video.removeEventListener('play', updateTimeAndDrawing)
      video.removeEventListener('pause', updateTimeAndDrawing)
      video.removeEventListener('seeked', updateTimeAndDrawing)
      video.removeEventListener('ended', () => setIsPlaying(false))
      window.removeEventListener('resize', updateVideoSize)
    }
  }, [comments])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed
    }
  }, [playbackSpeed])

  const updateActiveCommentDrawing = (currentTime: number) => {
    const activeComment = comments.find(comment =>
      currentTime >= comment.timestamp &&
      currentTime < comment.timestamp + 3 && // Show drawing for 3 seconds
      comment.drawing
    )
    setActiveCommentDrawing(activeComment ? activeComment.drawing : null)
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleLoop = () => {
    if (videoRef.current) {
      videoRef.current.loop = !isLooping
      setIsLooping(!isLooping)
    }
  }

  const toggleDraw = () => {
    setIsDrawingMode(!isDrawingMode);
    setIsCommentingWithDrawing(!isDrawingMode);
    if (!isDrawingMode) {
      if (videoRef.current) {
        videoRef.current.pause();
        setCommentDrawingTimestamp(videoRef.current.currentTime);
      }
      setIsPlaying(false);
    } else {
      setCurrentDrawing(null);
      setCommentDrawingTimestamp(null);
    }
  };

  const handleDrawingComplete = (dataURL: string) => {
    setCurrentDrawing(dataURL)
  }

  const clearDrawing = () => {
    setCurrentDrawing(null)
  }

  const addComment = () => {
    if (newComment.trim() && videoRef.current) {
      const newCommentObj: Comment = {
        id: Date.now(),
        text: newComment.trim(),
        timestamp: videoRef.current.currentTime,
        drawing: currentDrawing || undefined,
        replies: []
      }
      setComments(prevComments => [...prevComments, newCommentObj])
      setNewComment('')
      setCurrentDrawing(null)
      setIsDrawingMode(false)
      setIsCommentingWithDrawing(false)
      setCommentDrawingTimestamp(null)
    }
  }

  const addReply = (commentId: number) => {
    if (replyText.trim()) {
      setComments(prevComments => prevComments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [...comment.replies, { id: Date.now(), text: replyText }]
            }
          : comment
      ))
      setReplyText('')
      setReplyingTo(null)
    }
  }

  const jumpToTimestamp = (timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(timestamp, videoRef.current.duration)
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(time, videoRef.current.duration)
    }
  }

  const formatTimeDisplay = (time: number) => {
    if (timeFormat === 'remaining') {
      return '-' + formatTime(duration - time)
    }
    return formatTime(time)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4 flex flex-col md:flex-row gap-4">
      <div className="flex-grow space-y-2" ref={containerRef}>
        <div className="relative video-container" style={{ width: '100%', paddingBottom: `${(videoSize.height / videoSize.width) * 100}%` }}>
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-contain"
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          />
          {(isCommentingWithDrawing || activeCommentDrawing) && (
            <DrawingCanvas  
              width={videoSize.width}
              height={videoSize.height}
              isDrawing={isDrawingMode}
              color={drawingColor}
              brushSize={brushSize}
              drawingMode={drawingMode}
              onDrawingComplete={handleDrawingComplete}
              existingDrawing={activeCommentDrawing}
            />
          )}
        </div>
        <CustomProgressBar
          currentTime={currentTime}
          duration={duration}
          commentTimestamps={comments.map(comment => comment.timestamp)}
          onSeek={handleSeek}
        />
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={togglePlay} size="icon">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button onClick={toggleLoop} variant={isLooping ? "secondary" : "outline"} size="icon">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Select value={playbackSpeed.toString()} onValueChange={(value) => setPlaybackSpeed(parseFloat(value))}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5x</SelectItem>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="1.5">1.5x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={toggleDraw} variant={isDrawingMode ? "secondary" : "outline"} size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
            <input
              type="color"
              value={drawingColor}
              onChange={(e) => setDrawingColor(e.target.value)}
              className="w-8 h-8 p-0 border-none"
            />
            <Select value={brushSize.toString()} onValueChange={(value) => setBrushSize(parseInt(value))}>
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Brush" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">Thin</SelectItem>
                <SelectItem value="5">Medium</SelectItem>
                <SelectItem value="10">Thick</SelectItem>
              </SelectContent>
            </Select>
            <Select value={drawingMode} onValueChange={(value) => setDrawingMode(value as 'freehand' | 'circle' | 'arrow')}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="freehand">Freehand</SelectItem>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="arrow">Arrow</SelectItem>
              </SelectContent>
            </Select>
            {isDrawingMode && (
              <Button onClick={clearDrawing} variant="outline" size="icon">
                <Eraser className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTimeFormat(prev => prev === 'normal' ? 'remaining' : 'normal')}
            >
              <Clock className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              {formatTimeDisplay(currentTime)} / {formatTime(duration)}
            </span>
            <Button onClick={toggleFullscreen} size="icon" variant="ghost">
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="flex space-x-2">
          <Input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow"
          />
          <Button onClick={addComment}>Add Comment</Button>
        </div>
      </div>
      <div className="w-full md:w-80 bg-secondary p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Comments</h2>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {comments.map((comment) => (
            <div key={comment.id} className="mb-4">
              <div
                className="bg-background p-2 rounded cursor-pointer hover:bg-accent"
                onClick={() => jumpToTimestamp(comment.timestamp)}
              >
                <span className="font-medium text-primary">{formatTime(comment.timestamp)}</span>
                <p>{comment.text}</p>
                {comment.drawing && (
                  <img src={comment.drawing} alt="Comment drawing" className="mt-2 max-w-full h-auto" />
                )}
              </div>
              <div className="ml-4 mt-2">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="bg-muted p-2 rounded mb-2">
                    <p>{reply.text}</p>
                  </div>
                ))}
                {replyingTo === comment.id ? (
                  <div className="flex space-x-2 mt-2">
                    <Input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-grow"
                    />
                    <Button onClick={() => addReply(comment.id)}>Reply</Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReplyingTo(comment.id)}
                    className="mt-2"
                  >
                    Reply
                  </Button>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}

