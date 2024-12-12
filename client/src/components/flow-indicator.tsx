import React from "react"
import { cn } from "../lib/utils"

export function FlowIndicator({ steps, currentStep }) {
  return (
    <div className="flex justify-center items-center space-x-2 mb-8 flex-wrap">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center mb-2">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              index + 1 <= currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {index + 1}
          </div>
          <span className="ml-2 text-sm font-medium hidden sm:inline">{step}</span>
          {index < steps.length - 1 && (
            <div className="w-8 h-0.5 mx-1 bg-muted hidden sm:block" />
          )}
        </div>
      ))}
    </div>
  )
}

