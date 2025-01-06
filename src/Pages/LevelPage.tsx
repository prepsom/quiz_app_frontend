import { useNavigate, useParams } from 'react-router-dom'
import { Loader2, CheckCircle2, XCircle} from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { API_URL } from '@/App'
import QuestionPage from './QuestionPage'
import { QuestionResponseType, QuestionType } from '@/types'
import { useGetLevelById } from '@/hooks/useGetLevelById'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuestionsByLevel } from '@/hooks/useQuestionsByLevel'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useGetSubjectById } from '@/hooks/useGetSubjectById'
import { Timer } from '@/components/Timer'

interface LevelCompletionResponse {
  success: boolean
  message: string
  noOfCorrectQuestions?: number
  totalQuestions?: number
  percentage?: number
  isComplete?: boolean
}

export default function LevelPage() {
  const navigate = useNavigate();
  const { levelId } = useParams<{ levelId: string }>();
  if (!levelId) return null

  const { level, isLoading: isLevelLoading, error: isLevelError } = useGetLevelById(levelId)
  const {questions, isLoading: isQuestionsLoading, error: questionsError} = useQuestionsByLevel(levelId);
  const {subject,isLoading:isSubjectLoading,error:subjectError} = useGetSubjectById(level?.subjectId ? level.subjectId : null);

  const [showExitAlert,setShowExitAlert] = useState<boolean>(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [totalPointsInLevel, setTotalPointsInLevel] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);
  const [completionStatus, setCompletionStatus] = useState<LevelCompletionResponse | null>(null);
  const [isSubmittingCompletion, setIsSubmittingCompletion] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState<QuestionType[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentQuestionResponse,setCurrentQuestionResponse] = useState<QuestionResponseType | null>(null);
  const [questionTimerInSeconds,setQuestionTimerInSeconds] = useState<number>(0);

  // current question number = current no of questions attempted 
  // total questions in level -> fixed
  // available questions in level - > dynamic 
  // 4 -> answered , total -> 20
  // available questions -> 16 
  // therefore answered -> total quesitons.length - available.quesitions.length
  const questionNumber = useMemo(() => questions.length - availableQuestions.length , [questions,availableQuestions]);

  // Initialize available questions once when questions are loaded
  useEffect(() => {
    if (!isQuestionsLoading && questions.length > 0 && !isInitialized) {
      setAvailableQuestions(questions);
      setIsInitialized(true);
    }
  }, [isQuestionsLoading, questions, isInitialized]);

  // Handle game progression
  useEffect(() => {
    if (!isInitialized) return;
    
    if (availableQuestions.length===0 && !gameComplete && !currentQuestion) {
      console.log('current question :- ' , currentQuestion);
      setGameComplete(true);
      handleLevelCompletion();
    } else if (!currentQuestion && availableQuestions.length > 0) {
      console.log('available:- ' , availableQuestions);
      console.log('picked question')
      pickQuestion();
    }
  }, [isInitialized, availableQuestions, currentQuestion, gameComplete]);

  useEffect(() => {
    if(currentQuestion===null) return;

    setQuestionTimerInSeconds(0);
    const intevnal = setInterval(() => {
      setQuestionTimerInSeconds((prev) => prev+1);
    },1000);

    return () => clearInterval(intevnal);

  },[currentQuestion])

  const handleLevelCompletion = async () => {
    setIsSubmittingCompletion(true)
    try {
      const response = await axios.post<LevelCompletionResponse>(
        `${API_URL}/level/${levelId}/complete`,
        {},
        { withCredentials: true }
      )
      setCompletionStatus(response.data);
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
    let questionsByDifficulty = availableQuestions.filter((question) => question.difficulty === difficulty)
    
    while (questionsByDifficulty.length === 0) {
      if (difficulty === "EASY") {
        setDifficulty("MEDIUM")
        questionsByDifficulty = availableQuestions.filter((question) => question.difficulty === "MEDIUM")   
      } else if (difficulty === "MEDIUM") {
        setDifficulty("HARD")
        questionsByDifficulty = availableQuestions.filter((question) => question.difficulty === "HARD")
      } else {
        setGameComplete(true)
        return
      }
    }

    const nextQuestion = questionsByDifficulty[0];
    setCurrentQuestion(nextQuestion);
    setAvailableQuestions(prev => prev.filter(question => question.id !== nextQuestion.id));
  }

  const handleAnswerSubmit = async (answerId: string,responseTimeInSeconds:number) => {
    if (!currentQuestion) return
    try {
      console.log(responseTimeInSeconds);
      const response = await axios.post<{success:boolean;message:string;questionResponse:QuestionResponseType}>(
        `${API_URL}/question-response`,
        {
          questionId: currentQuestion.id,
          selectedAnswerId: answerId,
          timeTaken: responseTimeInSeconds,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setTotalPointsInLevel((prev) => prev + response.data.questionResponse.pointsEarned);
      setCurrentQuestionResponse(response.data.questionResponse);
    } catch (error) {
      console.error(error)
    }
  }

  const onNext = () => {
    setCurrentQuestion(null);
    setCurrentQuestionResponse(null);
  }
  
  const handleExit = () => {
    if (gameComplete || !currentQuestion) {
      navigate(`/levels/${level?.subjectId}`)
    } else {
      setShowExitAlert(true)
    }
  }

  if (isQuestionsLoading || isLevelLoading || isSubmittingCompletion || isSubjectLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (questionsError || isLevelError || subjectError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <p className="text-red-500">{questionsError !== "" ? questionsError : isLevelError}</p>
      </div>
    )
  }

  if (gameComplete && completionStatus) {
    return (
      <div className="min-h-screen max-w-[430px] flex items-center justify-center bg-gradient-to-b from-blue-100 to-white p-4">
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



  if (!currentQuestion &&  availableQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <p className="text-gray-600">No questions available</p>
      </div>
    )
  }  
  return (
    <>
      <div className="min-h-screen bg-[#ecfbff]">
        {/* Back Button */}
        <div className="flex p-4 items-center justify-between px-6">
          <div className='text-3xl text-gray-500 cursor-pointer hover:text-gray-700' onClick={handleExit}>
            <XCircle className='w-8 h-8'/>
          </div>
          {currentQuestionResponse===null && 
              <Timer seconds={questionTimerInSeconds}/>
          }
        </div>
        <div className='text-center mb-2'>
          <h1 className='font-bold text-blue-700 text-2xl'>{subject?.subjectName.toUpperCase()}</h1>
        </div>

        {currentQuestion && (
          <QuestionPage
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
            totalQuestions={questions.length}
            currentLevel={level}
            currentPointsInLevel={totalPointsInLevel}
            questionResponse={currentQuestionResponse}
            onNext={onNext}
            currentQuestionTimerInSeconds={questionTimerInSeconds}
            currentQuestionNumber={questionNumber}
          />
        )}
      </div>

      <AlertDialog open={showExitAlert} onOpenChange={setShowExitAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to exit?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress in this level will be lost. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => navigate(`/levels/${level?.subjectId}`)}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Exit Level
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}