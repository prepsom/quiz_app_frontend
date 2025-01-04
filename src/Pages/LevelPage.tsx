import { useParams } from 'react-router-dom'
import { useLevelQuestions } from '@/hooks/useLevelQuestions'
import { useQuestionWithAnswers } from '@/hooks/useQuestionWithAnswers'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '@/App'
import QuestionPage from './QuestionPage'
import { QuestionResponseType, QuestionType } from '@/types'
import { useGetLevelById } from '@/hooks/useGetLevelById'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface LevelCompletionResponse {
  success: boolean
  message: string
  noOfCorrectQuestions?: number
  totalQuestions?: number
  percentage?: number
  isComplete?: boolean
}

export default function LevelPage() {
  const { levelId } = useParams<{ levelId: string }>()
  if (!levelId) return null

  const { level, isLoading: isLevelLoading, error: isLevelError } = useGetLevelById(levelId)
  const {
    unansweredQuestions,
    isLoading,
    error,
    markQuestionAsAnswered,
    currentPointsInLevel
  } = useLevelQuestions(levelId)

  const [gameComplete, setGameComplete] = useState(false)
  const [totalPointsInLevel, setTotalPointsInLevel] = useState<number>(currentPointsInLevel)
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY")
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null)
  const [completionStatus, setCompletionStatus] = useState<LevelCompletionResponse | null>(null)
  const [isSubmittingCompletion, setIsSubmittingCompletion] = useState(false)

  const { question: questionWithAnswers, isLoading: isQuestionLoading } = 
    useQuestionWithAnswers(currentQuestion?.id ?? '')

  useEffect(() => {
    if (unansweredQuestions.length === 0 && !isLoading && !gameComplete) {
      setGameComplete(true)
      handleLevelCompletion()
    } else if (unansweredQuestions.length !== 0 && !isLoading) {
      pickQuestion()
    }
  }, [unansweredQuestions, isLoading, gameComplete])

  useEffect(() => {
    setTotalPointsInLevel(currentPointsInLevel)
  }, [currentPointsInLevel])

  const handleLevelCompletion = async () => {
    setIsSubmittingCompletion(true)
    try {
      const response = await axios.post<LevelCompletionResponse>(
        `${API_URL}/level/${levelId}/complete`,
        {},
        { withCredentials: true }
      )
      setCompletionStatus(response.data)
    } catch (error: any) {
      setCompletionStatus({
        success: false,
        message: error.response?.data?.message || "Failed to complete level"
      })
    } finally {
      setIsSubmittingCompletion(false)
    }
  }

  const pickQuestion = () => {
    let questionsByDifficulty = unansweredQuestions.filter((question) => question.difficulty === difficulty)
    
    while (questionsByDifficulty.length === 0) {
      if (difficulty === "EASY") {
        setDifficulty("MEDIUM")
        questionsByDifficulty = unansweredQuestions.filter((question) => question.difficulty === "MEDIUM")   
      } else if (difficulty === "MEDIUM") {
        setDifficulty("HARD")
        questionsByDifficulty = unansweredQuestions.filter((question) => question.difficulty === "HARD")
      } else {
        setGameComplete(true)
        return
      }
    }

    const nextQuestion = questionsByDifficulty[0]
    setCurrentQuestion(nextQuestion)
  }

  const handleAnswerSubmit = async (answerId: string) => {
    if (!currentQuestion) return

    try {
      const response = await axios.post<{success:boolean;message:string;questionResponse:QuestionResponseType}>(
        `${API_URL}/question-response`,
        {
          questionId: currentQuestion.id,
          selectedAnswerId: answerId,
          timeTaken: 90,
        },
        {
          withCredentials: true,
        }
      )
      setTotalPointsInLevel((prev) => prev + response.data.questionResponse.pointsEarned)
      markQuestionAsAnswered(currentQuestion.id)
      pickQuestion()
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading || isQuestionLoading || isLevelLoading || isSubmittingCompletion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error || isLevelError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (gameComplete && completionStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {completionStatus.success ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  Level Complete!
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-500" />
                  Level Not Complete
                </>
              )}
            </CardTitle>
            <CardDescription>
              {completionStatus.message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completionStatus.success && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Correct Answers: {completionStatus.noOfCorrectQuestions} / {completionStatus.totalQuestions}
                  </p>
                  <p className="text-sm text-gray-600">
                    Success Rate: {completionStatus.percentage}%
                  </p>
                  <p className="text-sm text-gray-600">
                    Points Earned: {totalPointsInLevel}
                  </p>
                </div>
              )}
              <div className="flex gap-4">
                <Button asChild className="w-full">
                  <Link to={`/levels/${level?.subjectId}`}>Return to Levels</Link>
                </Button>
                {!completionStatus.success && (
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!questionWithAnswers || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <p className="text-gray-600">No questions available</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white pt-8">
      <QuestionPage
        question={questionWithAnswers}
        onSubmit={handleAnswerSubmit}
        totalQuestions={unansweredQuestions.length}
        currentLevel={level}
      />
    </div>
  )
}

