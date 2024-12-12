import React, { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"

export function ProjectDetails({ onNext }) {
  const [details, setDetails] = useState({
    title: "",
    category: "",
    goals: "",
    competitors: "",
  })

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext(details)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Project Title</Label>
        <Input id="title" name="title" value={details.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" value={details.category} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="goals">Project Goals</Label>
        <Textarea id="goals" name="goals" value={details.goals} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="competitors">Competitor Videos</Label>
        <Textarea id="competitors" name="competitors" value={details.competitors} onChange={handleChange} required />
      </div>
      <Button type="submit" className="w-full">Next: Keyword Research</Button>
    </form>
  )
}

