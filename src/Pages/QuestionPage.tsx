import { LevelType, QuestionResponseType, QuestionType } from "@/types"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useQuestionWithAnswers } from "@/hooks/useQuestionWithAnswers"
import { CheckCircle2, XCircle, Trophy } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Timer } from "@/components/Timer"

interface QuestionPageProps {
  question: QuestionType
  onSubmit: (answerId: string, responseTimeInSeconds: number) => Promise<void>
  totalQuestions: number
  currentLevel: LevelType | null
  currentPointsInLevel: number
  questionResponse: QuestionResponseType | null
  onNext?: () => void
}

export default function QuestionPage({ 
  question, 
  onSubmit, 
  totalQuestions,
  currentLevel,
  currentPointsInLevel,
  questionResponse,
  onNext
}: QuestionPageProps) {
  const { question: currentQuestion, isLoading: isQuestionWithAnswersLoading } = useQuestionWithAnswers(question.id)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timerInSeconds, setTimerInSeconds] = useState<number>(0)

  useEffect(() => {
    setSelectedAnswer("")
    setTimerInSeconds(0)
  }, [question])
  
  useEffect(() => {
    if (questionResponse) return // Stop timer when question is answered
    
    setTimerInSeconds((prev) => prev + 1)
    const interval = setInterval(() => {
      setTimerInSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [questionResponse])

  const handleSubmit = async (responseTimeInSeconds: number) => {
    if (!selectedAnswer) return
    setIsSubmitting(true)
    await onSubmit(selectedAnswer, responseTimeInSeconds)
    setIsSubmitting(false)
  }

  if (isQuestionWithAnswersLoading) {
    return (
      <div className="w-full max-w-md mx-auto px-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto px-4">
      {/* Header Section */}
      <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Level {currentLevel?.position ? currentLevel.position + 1 : 1}
            </h1>
            <p className="text-sm text-gray-500">{currentLevel?.levelName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-gray-700">{currentPointsInLevel}</span>
          </div>
        </div>

        {/* Progress Bar */}
        {/* <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Question {question.position + 1} of {totalQuestions}</span>
            <span>{Math.round((question.position + 1) / totalQuestions * 100)}%</span>
          </div>
          <Progress value={((question.position + 1) / totalQuestions) * 100} />
        </div> */}
      </div>

      {/* Timer */}
      {questionResponse === null && (
        <div className="flex justify-center mb-6">
          <Timer seconds={timerInSeconds} />
        </div>
      )}

      {/* Question Card */}
      <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
        <h2 className="text-center text-gray-800 text-xl font-semibold mb-8">
          {currentQuestion?.questionTitle}
        </h2>

        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
          <div className="space-y-3">
            {currentQuestion?.Answers?.map((answer) => {
              const isSelected = questionResponse 
                ? questionResponse.chosenAnswerId === answer.id 
                : selectedAnswer === answer.id
              const showResult = questionResponse !== null
              const isChosenAnswer = questionResponse?.chosenAnswerId === answer.id

              return (
                <div
                  key={answer.id}
                  className={`
                    relative flex items-center p-4 rounded-xl transition-colors
                    ${showResult 
                      ? isChosenAnswer && questionResponse?.isCorrect
                        ? 'bg-green-100 border-green-200 border-2'
                        : isChosenAnswer && !questionResponse?.isCorrect
                          ? 'bg-red-100 border-red-200 border-2'
                          : 'bg-gray-50'
                      : isSelected
                        ? 'bg-blue-50 border-blue-200 border-2'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }
                  `}
                >
                  {!showResult ? (
                    <label className="flex items-center space-x-3 cursor-pointer w-full">
                      <RadioGroupItem 
                        value={answer.id} 
                        id={answer.id}
                        className="border-2 border-gray-300 text-blue-500"
                      />
                      <span className="text-gray-700">{answer.value}</span>
                    </label>
                  ) : (
                    <div className="flex items-center w-full">
                      {isChosenAnswer && (
                        questionResponse?.isCorrect 
                          ? <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          : <XCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                      )}
                      {!isChosenAnswer && <div className="w-5 h-5 mr-3" />}
                      <span 
                        className={`
                          ${isChosenAnswer && questionResponse?.isCorrect
                            ? 'text-green-700' 
                            : isChosenAnswer && !questionResponse?.isCorrect
                              ? 'text-red-700' 
                              : 'text-gray-700'
                          }
                        `}
                      >
                        {answer.value}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </RadioGroup>
      </div>

      {/* Result Display */}
      {questionResponse && (
        <div className={`bg-white rounded-3xl shadow-sm p-4 mb-2 ${
          questionResponse.isCorrect ? 'border-2 border-green-200' : 'border-2 border-red-200'
        }`}>
          <div className="flex items-center justify-center mb-4">
            {questionResponse.isCorrect ? (
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            ) : (
              <XCircle className="w-12 h-12 text-red-500" />
            )}
          </div>
          <h3 className={`text-center text-2xl font-semibold mb-4 ${
            questionResponse.isCorrect ? 'text-green-700' : 'text-red-700'
          }`}>
            {questionResponse.isCorrect ? 'Correct!' : 'Incorrect'}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500">Points earned</p>
              <p className="text-lg font-semibold text-gray-900">{questionResponse.pointsEarned}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500">Response time</p>
              <p className="text-lg font-semibold text-gray-900">{questionResponse.responseTime}s</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      {!questionResponse ? (
        <Button
          onClick={() => handleSubmit(timerInSeconds)}
          disabled={!selectedAnswer || isSubmitting}
          className="w-full py-6 text-lg font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>Submitting...</span>
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      ) : (
        <Button
          onClick={onNext}
          className="w-full py-6 text-lg font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
        >
          Next Question
        </Button>
      )}
    </div>
  )
}

