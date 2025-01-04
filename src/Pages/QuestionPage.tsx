import { LevelType, QuestionType } from "@/types"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface QuestionPageProps {
  question: QuestionType
  onSubmit: (answerId: string) => Promise<void>
  totalQuestions: number
  currentLevel:LevelType | null;
}

export default function QuestionPage({ question, onSubmit, totalQuestions,currentLevel}: QuestionPageProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedAnswer) return
    setIsSubmitting(true)
    await onSubmit(selectedAnswer)
    setIsSubmitting(false)
    setSelectedAnswer("")
  }

  return (
    <div className="w-full max-w-md mx-auto px-4">
      {/* Level Title */}
      <div className="text-blue-600 mb-4">
        <h1 className="text-sm font-medium">
          LEVEL {currentLevel?.position ? currentLevel.position+1 : 1} {currentLevel?.levelName}
        </h1>
      </div>

      {/* Question Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-blue-500">
          Question 1 of {totalQuestions}
        </span>
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-blue-100 overflow-hidden">
          <img
            src="/placeholder.svg?height=64&width=64"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
        <h2 className="text-center text-gray-800 text-lg font-medium mb-8">
          {question.questionTitle}
        </h2>

        <RadioGroup
          value={selectedAnswer}
          onValueChange={setSelectedAnswer}
          className="space-y-3"
        >
          {question.Answers?.map((answer) => (
            <label
              key={answer.id}
              className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer transition-colors
                ${selectedAnswer === answer.id ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              <RadioGroupItem 
                value={answer.id} 
                id={answer.id}
                className="border-2 border-gray-300 text-blue-500"
              />
              <span className="text-gray-700">{answer.value}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!selectedAnswer || isSubmitting}
        className="w-full py-6 text-lg font-medium bg-blue-400 hover:bg-blue-500 text-white rounded-xl"
      >
        {isSubmitting ? "Submitting..." : "SUBMIT"}
      </Button>
    </div>
  )
}

