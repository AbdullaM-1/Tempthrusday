import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface KeywordResearchProps {
  onComplete: (selectedKeywords: string[]) => void
}

interface YouTubeResult {
  title: string
  views: string
  channel: string
}

interface ChatGPTSuggestion {
  keyword: string
  score: number
}

export function KeywordResearch({ onComplete }: KeywordResearchProps) {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])

  // Dummy data
  const preSavedTitle = "How to Make Delicious Homemade Pizza"
  const youtubeResults: YouTubeResult[] = [
    { title: "Perfect Homemade Pizza Recipe", views: "1.2M", channel: "CookingPro" },
    { title: "Easy Pizza from Scratch", views: "890K", channel: "QuickMeals" },
    { title: "Secret to Crispy Pizza Crust", views: "2.5M", channel: "ItalianChef" },
    { title: "Gourmet Pizza at Home", views: "750K", channel: "FoodieDelights" },
    { title: "5 Pizza Mistakes to Avoid", views: "1.8M", channel: "CookingTips" },
  ]

  const chatGPTSuggestions: ChatGPTSuggestion[] = [
    { keyword: "homemade pizza recipe", score: 95 },
    { keyword: "easy pizza dough", score: 88 },
    { keyword: "best pizza toppings", score: 82 },
    { keyword: "pizza sauce from scratch", score: 79 },
    { keyword: "wood-fired pizza at home", score: 75 },
  ]

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    )
  }

  const handleComplete = () => {
    onComplete(selectedKeywords)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Keyword Research</h2>
      <Card>
        <CardHeader>
          <CardTitle>Your Video Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">{preSavedTitle}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>YouTube Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {youtubeResults.map((result, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="font-medium">{result.title}</span>
                <div className="text-sm text-muted-foreground">
                  <span>{result.views} views</span>
                  <span className="mx-2">•</span>
                  <span>{result.channel}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ChatGPT Keyword Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {chatGPTSuggestions.map((suggestion, index) => (
              <Badge 
                key={index}
                variant={selectedKeywords.includes(suggestion.keyword) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleKeywordToggle(suggestion.keyword)}
              >
                {suggestion.keyword} ({suggestion.score})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold mb-2">Selected Keywords:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedKeywords.map((keyword, index) => (
              <Badge key={index} variant="secondary">{keyword}</Badge>
            ))}
          </div>
        </div>
        <Button onClick={handleComplete} size="lg">
          Next: Description & Tags
        </Button>
      </div>
    </div>
  )
}

