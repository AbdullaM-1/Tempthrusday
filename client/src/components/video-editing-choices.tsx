import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Img } from "react-image";

interface VideoEditingChoicesProps {
  onComplete: (data: VideoEditingData) => void
}

interface VideoEditingData {
  editingType: "2d-animation" | "sourcing-clipping-editing"
  softwareFeatures?: string[]
}

interface PreviousVideo {
  id: string
  title: string
  thumbnail: string
}

export function VideoEditingChoices({ onComplete }: VideoEditingChoicesProps) {
  const [editingType, setEditingType] = useState<"2d-animation" | "sourcing-clipping-editing" | null>(null)
  const [softwareFeatures, setSoftwareFeatures] = useState<string[]>([])

  // Dummy data for previous videos
  const previousVideos: PreviousVideo[] = [
    { id: "1", title: "Animated Explainer Video", thumbnail: "/placeholder.svg?height=90&width=160" },
    { id: "2", title: "Product Demo", thumbnail: "/placeholder.svg?height=90&width=160" },
    { id: "3", title: "Tutorial Series", thumbnail: "/placeholder.svg?height=90&width=160" },
  ]

  // Dummy data for cloud videos
  const cloudVideos = [
    { id: "1", title: "2D Character Animation", url: "https://example.com/2d-character-animation" },
    { id: "2", title: "Motion Graphics", url: "https://example.com/motion-graphics" },
    { id: "3", title: "Whiteboard Animation", url: "https://example.com/whiteboard-animation" },
  ]

  const handleSoftwareFeatureToggle = (feature: string) => {
    setSoftwareFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const handleComplete = () => {
    if (editingType) {
      onComplete({
        editingType,
        ...(editingType === "2d-animation" && { softwareFeatures }),
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Video Editing Choices</h2>

      <Card>
        <CardHeader>
          <CardTitle>Select Editing Type</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup onValueChange={(value) => setEditingType(value as "2d-animation" | "sourcing-clipping-editing")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2d-animation" id="2d-animation" />
              <Label htmlFor="2d-animation">2D Animated Videos</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sourcing-clipping-editing" id="sourcing-clipping-editing" />
              <Label htmlFor="sourcing-clipping-editing">Sourcing, Clipping, and Editing</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {editingType === "2d-animation" && (
        <Card>
          <CardHeader>
            <CardTitle>2D Animation Software Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {["Character Animation", "Motion Graphics", "Text Animation", "Scene Transitions", "Custom Illustrations", "Voice-over Integration"].map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={softwareFeatures.includes(feature)}
                    onCheckedChange={() => handleSoftwareFeatureToggle(feature)}
                  />
                  <label
                    htmlFor={feature}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {feature}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Cloud Videos Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cloudVideos.map((video) => (
              <div key={video.id} className="flex flex-col items-center">
                <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center mb-2">
                  <span className="text-muted-foreground">Video Preview</span>
                </div>
                <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
                  {video.title}
                </a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Previous Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {previousVideos.map((video) => (
              <div key={video.id} className="flex flex-col items-center">
                <Img
                  src={video.thumbnail}
                  alt={video.title}
                  width={160}
                  height={90}
                  className="rounded-md mb-2"
                />
                <span className="text-sm font-medium">{video.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleComplete} size="lg" disabled={!editingType}>
          Next
        </Button>
      </div>
    </div>
  )
}

