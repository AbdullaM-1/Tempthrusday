import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DescriptionAndTagsProps {
  onComplete: (data: { description: string; tags: string[] }) => void
  title: string
}

export function DescriptionAndTags({ onComplete, title }: DescriptionAndTagsProps) {
  const [description, setDescription] = useState("")
  const [aiInput, setAiInput] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Dummy function to simulate AI-generated description
  const generateAIDescription = (input: string) => {
    return `This video about "${title}" ${input} It covers essential techniques, tips, and tricks to help you create the perfect homemade pizza. From making the dough to choosing the best toppings, we've got you covered. Don't forget to like and subscribe for more cooking tutorials!`
  }

  const handleAIGenerate = () => {
    const generatedDescription = generateAIDescription(aiInput)
    setDescription(generatedDescription)
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleComplete = () => {
    onComplete({ description, tags: selectedTags })
  }

  // Dummy tag suggestions
  const suggestedTags = [
    "homemade pizza", "pizza recipe", "cooking tutorial", "Italian cuisine",
    "dough making", "pizza toppings", "baking tips", "food vlog",
    "easy recipes", "kitchen hacks", "crispy crust", "cheese blend",
    "sauce recipe", "pizza oven", "family dinner", "weekend cooking",
    "gourmet pizza", "vegetarian options", "meat lovers pizza", "dessert pizza"
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Video Description and Tags</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Video Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">{title}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Video Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual">
            <TabsList>
              <TabsTrigger value="manual">Write Manually</TabsTrigger>
              <TabsTrigger value="ai">AI Assisted</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <Textarea
                placeholder="Write your video description here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full"
              />
            </TabsContent>
            <TabsContent value="ai">
              <div className="space-y-4">
                <Input
                  placeholder="Provide some input for the AI (e.g., key points, tone, style)"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                />
                <Button onClick={handleAIGenerate}>Generate Description</Button>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Video Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Select relevant tags for your video:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag, index) => (
                <Badge
                  key={index}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Selected Tags:</p>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleComplete} size="lg">
          Complete Order
        </Button>
      </div>
    </div>
  )
}

