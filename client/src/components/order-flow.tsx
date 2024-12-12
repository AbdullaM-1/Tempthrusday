import React, { useState } from "react"
import { FlowIndicator } from "./flow-indicator"
import { ServiceSelection } from "./service-selection"
import { ProjectDetails } from "./project-details"
import { KeywordResearch } from "./keyword-research"
import { DescriptionAndTags } from "./description-and-tags"
import { Screenwriting } from "./screenwriting"
import { VideoEditingChoices } from "./video-editing-choices"
import { ThumbnailDesign } from "./thumbnail-design"
import { PaymentPage } from "./payment-page"

const steps = [
  "Service Selection",
  "Project Details",
  "Keyword Research",
  "Description & Tags",
  "Screenwriting",
  "Video Editing",
  "Thumbnail Design",
  "Payment"
]

export function OrderFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [orderData, setOrderData] = useState({
    service: "",
    details: {},
    keywords: [],
    description: "",
    tags: [],
    screenwriting: {},
    videoEditing: {},
    thumbnailDesign: {},
    payment: {},
  })

  const handleServiceSelection = (service) => {
    setOrderData({ ...orderData, service })
    setCurrentStep(2)
  }

  const handleProjectDetails = (details) => {
    setOrderData({ ...orderData, details })
    setCurrentStep(3)
  }

  const handleKeywordResearch = (keywords) => {
    setOrderData({ ...orderData, keywords })
    setCurrentStep(4)
  }

  const handleDescriptionAndTags = (data) => {
    setOrderData({ ...orderData, description: data.description, tags: data.tags })
    setCurrentStep(5)
  }

  const handleScreenwriting = (data) => {
    setOrderData({ ...orderData, screenwriting: data })
    setCurrentStep(6)
  }

  const handleVideoEditingChoices = (data) => {
    setOrderData({ ...orderData, videoEditing: data })
    setCurrentStep(7)
  }

  const handleThumbnailDesign = (data) => {
    setOrderData({ ...orderData, thumbnailDesign: data })
    setCurrentStep(8)
  }

  const handlePayment = (data) => {
    setOrderData({ ...orderData, payment: data })
    handleComplete()
  }

  const handleComplete = () => {
    console.log("Order completed:", orderData)
    // Here you would typically submit the order data to your backend
    setCurrentStep(1) // Reset to the first step
  }

  // Dummy function to calculate total amount
  const calculateTotalAmount = () => {
    // In a real application, this would be based on the selected services and options
    return 999.99
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FlowIndicator steps={steps} currentStep={currentStep} />
      {currentStep === 1 && <ServiceSelection onNext={handleServiceSelection} />}
      {currentStep === 2 && <ProjectDetails onNext={handleProjectDetails} />}
      {currentStep === 3 && <KeywordResearch onComplete={handleKeywordResearch} />}
      {currentStep === 4 && (
        <DescriptionAndTags
          onComplete={handleDescriptionAndTags}
          title={orderData.details.title || "How to Make Delicious Homemade Pizza"}
        />
      )}
      {currentStep === 5 && <Screenwriting onComplete={handleScreenwriting} />}
      {currentStep === 6 && <VideoEditingChoices onComplete={handleVideoEditingChoices} />}
      {currentStep === 7 && <ThumbnailDesign onComplete={handleThumbnailDesign} />}
      {currentStep === 8 && <PaymentPage onComplete={handlePayment} totalAmount={calculateTotalAmount()} />}
    </div>
  )
}

