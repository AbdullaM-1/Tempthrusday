import React, { useRef, useEffect, useState } from 'react'

interface DrawingCanvasProps {
  width: number
  height: number
  isDrawing: boolean
  color: string
  brushSize: number
  drawingMode: 'freehand' | 'circle' | 'arrow'
  onDrawingComplete: (dataURL: string) => void
  existingDrawing: string | null
}

export function DrawingCanvas({ width, height, isDrawing, color, brushSize, drawingMode, onDrawingComplete, existingDrawing }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawingActive, setIsDrawingActive] = useState(false)
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

  const scaleCoordinates = (x: number, y: number, rect: DOMRect) => {
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    return {
      x: x * scaleX,
      y: y * scaleY
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setContext(ctx)

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Clear the canvas
    ctx.clearRect(0, 0, width, height)

    // Draw existing drawing if available
    if (existingDrawing) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height)
      }
      img.src = existingDrawing
    }

  }, [width, height, existingDrawing])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !context) return

    let lastX = 0
    let lastY = 0

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingActive) return
      const rect = canvas.getBoundingClientRect()
      let { x, y } = e instanceof MouseEvent
        ? scaleCoordinates(e.clientX - rect.left, e.clientY - rect.top, rect)
        : scaleCoordinates(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top, rect);

      context.strokeStyle = color
      context.fillStyle = color
      context.lineWidth = brushSize
      context.lineCap = 'round'
      context.lineJoin = 'round'

      if (drawingMode === 'freehand') {
        context.beginPath()
        context.moveTo(lastX, lastY)
        context.lineTo(x, y)
        context.stroke()
      } else if (drawingMode === 'circle' && startPoint) {
        const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2))
        context.clearRect(0, 0, canvas.width, canvas.height)
        if (existingDrawing) {
          const img = new Image()
          img.onload = () => {
            context.drawImage(img, 0, 0, width, height)
            context.beginPath()
            context.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI)
            context.stroke()
          }
          img.src = existingDrawing
        } else {
          context.beginPath()
          context.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI)
          context.stroke()
        }
      } else if (drawingMode === 'arrow' && startPoint) {
        drawArrow(context, startPoint.x, startPoint.y, x, y)
      }

      lastX = x
      lastY = y
    }

    const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) => {
      const headLength = 15
      const angle = Math.atan2(toY - fromY, toX - fromX)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (existingDrawing) {
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height)
          ctx.beginPath()
          ctx.moveTo(fromX, fromY)
          ctx.lineTo(toX, toY)
          ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6))
          ctx.moveTo(toX, toY)
          ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6))
          ctx.stroke()
        }
        img.src = existingDrawing
      } else {
        ctx.beginPath()
        ctx.moveTo(fromX, fromY)
        ctx.lineTo(toX, toY)
        ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6))
        ctx.moveTo(toX, toY)
        ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6))
        ctx.stroke()
      }
    }

    const handleStart = (e: MouseEvent | TouchEvent) => {
      setIsDrawingActive(true)
      const rect = canvas.getBoundingClientRect()
      const { x, y } = e instanceof MouseEvent
        ? scaleCoordinates(e.clientX - rect.left, e.clientY - rect.top, rect)
        : scaleCoordinates(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top, rect);
      lastX = x;
      lastY = y;
      setStartPoint({ x, y })
    }

    const handleEnd = () => {
      setIsDrawingActive(false)
      setStartPoint(null)
      onDrawingComplete(canvas.toDataURL())
    }

    if (isDrawing) {
      canvas.addEventListener('mousedown', handleStart)
      canvas.addEventListener('mousemove', draw)
      canvas.addEventListener('mouseup', handleEnd)
      canvas.addEventListener('mouseout', handleEnd)
      canvas.addEventListener('touchstart', handleStart)
      canvas.addEventListener('touchmove', draw)
      canvas.addEventListener('touchend', handleEnd)
    }

    return () => {
      canvas.removeEventListener('mousedown', handleStart)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', handleEnd)
      canvas.removeEventListener('mouseout', handleEnd)
      canvas.removeEventListener('touchstart', handleStart)
      canvas.removeEventListener('touchmove', draw)
      canvas.removeEventListener('touchend', handleEnd)
    }
  }, [isDrawing, color, brushSize, drawingMode, onDrawingComplete, startPoint, context, existingDrawing, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`absolute top-0 left-0 w-full h-full ${isDrawing ? 'cursor-crosshair' : ''}`}
      style={{ 
        pointerEvents: isDrawing ? 'auto' : 'none',
        opacity: existingDrawing || isDrawing ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
    />
  )
}

