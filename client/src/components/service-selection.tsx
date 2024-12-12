import React from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

export function ServiceSelection({ onNext }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="cursor-pointer hover:border-primary" onClick={() => onNext("video-editing")}>
        <CardHeader>
          <CardTitle>Video Editing Service</CardTitle>
          <CardDescription>Professional editing for your raw footage</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Select Video Editing</Button>
        </CardContent>
      </Card>
      <Card className="cursor-pointer hover:border-primary" onClick={() => onNext("full-production")}>
        <CardHeader>
          <CardTitle>Full Video Production</CardTitle>
          <CardDescription>End-to-end video creation and editing</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Select Full Production</Button>
        </CardContent>
      </Card>
    </div>
  )
}

