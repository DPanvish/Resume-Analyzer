// Coded using an ai agent Junie

import React from 'react'
import { cn } from '~/lib/utils'
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionContent
} from './Accordion'

// Import Feedback type
// import type { Feedback } from '../../types'

// Helper Components
const ScoreBadge = ({ score }: { score: number }) => {
  // Determine background color and icon based on score
  const bgColor = score > 69 
    ? 'bg-green-100' 
    : score > 39 
      ? 'bg-yellow-100' 
      : 'bg-red-100'
  
  const textColor = score > 69 
    ? 'text-green-700' 
    : score > 39 
      ? 'text-yellow-700' 
      : 'text-red-700'
  
  const icon = score > 69 
    ? '/icons/check.svg' 
    : '/icons/warning.svg'

  return (
    <div className={cn('flex items-center gap-1 px-2 py-1 rounded-md', bgColor)}>
      <img src={icon} alt="score icon" className="w-4 h-4" />
      <span className={cn('text-sm font-medium', textColor)}>{score}/100</span>
    </div>
  )
}

const CategoryHeader = ({ title, categoryScore }: { title: string, categoryScore: number }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <h3 className="text-lg font-medium text-gray-800">{title}</h3>
      <ScoreBadge score={categoryScore} />
    </div>
  )
}

const CategoryContent = ({ tips }: { tips: Array<{ type: "good" | "improve", tip: string, explanation: string }> }) => {
  return (
    <div className="space-y-4">
      {/* Two-column grid for tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-2">
            <img 
              src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"} 
              alt={tip.type === "good" ? "good" : "improve"} 
              className={cn(
                "w-5 h-5 mt-0.5",
                tip.type === "good" ? "text-green-500" : "text-yellow-500"
              )}
            />
            <span className="text-sm text-gray-700">{tip.tip}</span>
          </div>
        ))}
      </div>
      
      {/* Explanation boxes */}
      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div 
            key={index} 
            className={cn(
              "p-3 rounded-md text-sm",
              tip.type === "good" 
                ? "bg-green-50 border border-green-100" 
                : "bg-yellow-50 border border-yellow-100"
            )}
          >
            <p className="text-gray-700">{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main Component
interface DetailsProps {
  feedback: Feedback
}

const Details = ({ feedback }: DetailsProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Accordion className="space-y-4">
        <AccordionItem id="tone-style" className="border rounded-lg overflow-hidden">
          <AccordionHeader itemId="tone-style" className="bg-white hover:bg-gray-50">
            <CategoryHeader 
              title="Tone & Style" 
              categoryScore={feedback.toneAndStyle.score} 
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style" className="bg-white">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="content" className="border rounded-lg overflow-hidden">
          <AccordionHeader itemId="content" className="bg-white hover:bg-gray-50">
            <CategoryHeader 
              title="Content" 
              categoryScore={feedback.content.score} 
            />
          </AccordionHeader>
          <AccordionContent itemId="content" className="bg-white">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="structure" className="border rounded-lg overflow-hidden">
          <AccordionHeader itemId="structure" className="bg-white hover:bg-gray-50">
            <CategoryHeader 
              title="Structure" 
              categoryScore={feedback.structure.score} 
            />
          </AccordionHeader>
          <AccordionContent itemId="structure" className="bg-white">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="skills" className="border rounded-lg overflow-hidden">
          <AccordionHeader itemId="skills" className="bg-white hover:bg-gray-50">
            <CategoryHeader 
              title="Skills" 
              categoryScore={feedback.skills.score} 
            />
          </AccordionHeader>
          <AccordionContent itemId="skills" className="bg-white">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default Details

