import { useNavigate, useParams } from "react-router-dom";
import { Loader2, XCircle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { API_URL } from "@/App";
import QuestionPage from "./QuestionPage";
import {
  LevelCompletionResponse,
  QuestionResponseData,
  QuestionResponseRequestBody,
  QuestionResponseType,
  QuestionType,
} from "@/types";
import { useGetLevelById } from "@/hooks/useGetLevelById";
import { useQuestionsByLevel } from "@/hooks/useQuestionsByLevel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGetSubjectById } from "@/hooks/useGetSubjectById";
import { Timer } from "@/components/Timer";
import FeedbackPage from "./FeedbackPage";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// const exampleCompletionData: LevelCompletionResponse = {
//   success: true,
//   message: "Level completed",
//   isComplete: true,
//   noOfCorrectQuestions: 4,
//   totalQuestions: 8,
//   percentage: 50,
//   totalPointsEarnedInLevel: 80,
//   recommendations: [
//     "recommended lorem ipsum asjdaklsjd asjdklajsd askdj",
//     "asldkjasldk  asjdlajsd asljkdalsd",
//   ],
//   strengths: ["asdasd asdasd asdasd", "asjdaklsd asdjlaksjd aasdja;sd"],
//   weaknesses: ["sjdaslkdja", "sajd;kasjdasd", "sajd;klasjdasd"],
// };

export const MAX_QUESTIONS_PER_LEVEL = 15;

export default function LevelPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { levelId } = useParams<{ levelId: string }>();
  if (!levelId) return null;

  const { level, isLoading: isLevelLoading } = useGetLevelById(levelId);
  const { questions, isLoading: isQuestionsLoading } =
    useQuestionsByLevel(levelId);
  const { subject, isLoading: isSubjectLoading } = useGetSubjectById(
    level?.subjectId ? level.subjectId : null
  );

  const [showExitAlert, setShowExitAlert] = useState<boolean>(false);
  const [gameComplete, setGameComplete] = useState<boolean>(false);
  const [totalPointsInLevel, setTotalPointsInLevel] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">(
    "EASY"
  );
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(
    null
  );
  const [completionStatus, setCompletionStatus] =
    useState<LevelCompletionResponse | null>(null);
  const [isSubmittingCompletion, setIsSubmittingCompletion] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState<QuestionType[]>(
    []
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentQuestionResponse, setCurrentQuestionResponse] =
    useState<QuestionResponseType | null>(null);
  const [questionTimerInSeconds, setQuestionTimerInSeconds] =
    useState<number>(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState<number>(0);
  const [consecutiveIncorrect, setConsecutiveIncorrect] = useState<number>(0);
  const [correctAnswerData, setCorrectAnswerData] =
    useState<QuestionResponseData["correctData"]>();
  const [questionsPickedCounter, setQuestionsPickedCounter] =
    useState<number>(0);
  const [pickedQuestions, setPickedQuestions] = useState<QuestionType[]>([]);
  const [isFirstQuestionOfLevel, setIsFirstQuestionOfLevel] =
    useState<boolean>(true);

  const questionNumber = useMemo(
    () => questions.length - availableQuestions.length,
    [questions, availableQuestions]
  );

  useEffect(() => {
    if (!isQuestionsLoading && questions.length > 0 && !isInitialized) {
      setAvailableQuestions(questions);
      setIsInitialized(true);
    }
  }, [isQuestionsLoading, questions, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    if (
      questionsPickedCounter === MAX_QUESTIONS_PER_LEVEL &&
      !currentQuestion
    ) {
      setGameComplete(true);
      handleLevelCompletion();
    } else if (
      availableQuestions.length === 0 &&
      !gameComplete &&
      !currentQuestion
    ) {
      setGameComplete(true);
      handleLevelCompletion();
    } else if (
      !currentQuestion &&
      availableQuestions.length > 0 &&
      questionsPickedCounter <= MAX_QUESTIONS_PER_LEVEL
    ) {
      pickQuestion();
      setQuestionsPickedCounter((prev) => prev + 1);
    }
  }, [isInitialized, availableQuestions, currentQuestion, gameComplete]);

  useEffect(() => {
    if (currentQuestion === null) return;

    setQuestionTimerInSeconds(0);
    const interval = setInterval(() => {
      setQuestionTimerInSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion]);

  useEffect(() => {
    // Reset states when levelId changes
    setGameComplete(false);
    setCompletionStatus(null);
    setTotalPointsInLevel(0);
    setCurrentQuestion(null);
    setAvailableQuestions([]);
    setIsInitialized(false);
    setCurrentQuestionResponse(null);
    setQuestionTimerInSeconds(0);
    setConsecutiveCorrect(0);
    setConsecutiveIncorrect(0);
    setCorrectAnswerData(undefined);
    setQuestionsPickedCounter(0);
    setPickedQuestions([]);
    setIsFirstQuestionOfLevel(true);
  }, [levelId]);

  const handleLevelCompletion = async () => {
    setIsSubmittingCompletion(true);
    try {
      const response = await axios.post<LevelCompletionResponse>(
        `${API_URL}/level/${levelId}/complete`,
        {
          answeredQuestionsInLevel: pickedQuestions.map(
            (pickedQuestion) => pickedQuestion.id
          ),
        },
        { withCredentials: true }
      );
      setCompletionStatus(response.data);
    } catch (error: any) {
      setCompletionStatus({
        success: false,
        message: error.response?.data?.message || "Failed to complete level",
      });
    } finally {
      setIsSubmittingCompletion(false);
    }
  };

  const pickQuestion = () => {
    let questionsByDifficulty = availableQuestions.filter(
      (question) => question.difficulty === difficulty
    );

    if (questionsByDifficulty.length === 0) {
      if (
        difficulty === "EASY" &&
        availableQuestions.some((q) => q.difficulty === "MEDIUM")
      ) {
        setDifficulty("MEDIUM");
        questionsByDifficulty = availableQuestions.filter(
          (q) => q.difficulty === "MEDIUM"
        );
      } else if (
        difficulty === "MEDIUM" &&
        availableQuestions.some((q) => q.difficulty === "HARD")
      ) {
        setDifficulty("HARD");
        questionsByDifficulty = availableQuestions.filter(
          (q) => q.difficulty === "HARD"
        );
      } else if (availableQuestions.length > 0) {
        // If there are still questions available, reset to the easiest available difficulty
        const easiestAvailableDifficulty = ["EASY", "MEDIUM", "HARD"].find(
          (diff) => availableQuestions.some((q) => q.difficulty === diff)
        );
        if (easiestAvailableDifficulty) {
          setDifficulty(
            easiestAvailableDifficulty as "EASY" | "MEDIUM" | "HARD"
          );
          questionsByDifficulty = availableQuestions.filter(
            (q) => q.difficulty === easiestAvailableDifficulty
          );
        }
      }
    }

    if (questionsByDifficulty.length === 0) {
      setGameComplete(true);
      return;
    }

    // once questions are filtered by difficulty , and its the levels first question then pick a mcq type question
    questionsByDifficulty
      .filter((question) => question.questionType === "MCQ")
      .map((question) => question.id);

    let nextQuestion: QuestionType | undefined;

    if (isFirstQuestionOfLevel) {
      const firstMcqQuestionsInLevel = questionsByDifficulty.filter(
        (question) => question.questionType === "MCQ"
      );
      nextQuestion = questionsByDifficulty.find(
        (question) => question.id === firstMcqQuestionsInLevel[0].id
      );
    } else {
      nextQuestion =
        questionsByDifficulty[
          Math.floor(Math.random() * questionsByDifficulty.length)
        ];
    }

    if (isFirstQuestionOfLevel && nextQuestion === undefined) {
      nextQuestion =
        questionsByDifficulty[
          Math.floor(Math.random() * questionsByDifficulty.length)
        ];
    }

    // if nextQuestion is undefined and it was the first question of level
    setCurrentQuestion(nextQuestion!);
    setPickedQuestions((prev) => [...prev, nextQuestion!]);
    setAvailableQuestions((prev) =>
      prev.filter((question) => question.id !== nextQuestion!.id)
    );
    isFirstQuestionOfLevel && setIsFirstQuestionOfLevel(false);
  };

  const handleAnswerSubmit = async (
    responseData: QuestionResponseRequestBody
  ) => {
    if (!currentQuestion) return;
    try {
      const response = await axios.post<QuestionResponseData>(
        `${API_URL}/question-response`,
        responseData,
        {
          withCredentials: true,
        }
      );

      const { questionResponse, correctData } = response.data;

      setTotalPointsInLevel((prev) => prev + questionResponse.pointsEarned);
      setCurrentQuestionResponse(questionResponse);

      if (questionResponse.isCorrect) {
        setConsecutiveCorrect((prev) => prev + 1);
        setConsecutiveIncorrect(0);
        if (consecutiveCorrect === 1) {
          setConsecutiveCorrect(0);
          if (difficulty === "EASY") setDifficulty("MEDIUM");
          else if (difficulty === "MEDIUM") setDifficulty("HARD");
        }
      } else {
        setConsecutiveIncorrect((prev) => prev + 1);
        setConsecutiveCorrect(0);
        if (consecutiveIncorrect === 1) {
          setConsecutiveIncorrect(0);
          if (difficulty === "HARD") setDifficulty("MEDIUM");
          else if (difficulty === "MEDIUM") setDifficulty("EASY");
        }
      }

      // Pass correctData to QuestionPage
      setCorrectAnswerData(correctData);
    } catch (error) {
      toast({
        title: "Error when answering question",
        description: "Please check your network connection",
        variant: "destructive",
      });
    }
  };

  const onNext = () => {
    setCurrentQuestion(null);
    setCurrentQuestionResponse(null);
    setCorrectAnswerData(undefined);
  };

  const handleExit = () => {
    if (gameComplete || !currentQuestion) {
      navigate(`/levels/${level?.subjectId}`);
    } else {
      setShowExitAlert(true);
    }
  };

  if (
    isQuestionsLoading ||
    isLevelLoading ||
    isSubmittingCompletion ||
    isSubjectLoading
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-2 bg-gradient-to-b from-blue-100 to-white">
        {isSubmittingCompletion && (
          <div className="text-blue-500 font-semibold">Generating Report</div>
        )}
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (gameComplete && completionStatus) {
    return (
      <>
        <FeedbackPage
          setGameComplete={setGameComplete}
          setCompletionStatus={setCompletionStatus}
          levelCompletionData={completionStatus}
          level={level!}
        />
        <Navigation />
      </>
    );
  }

  if (!currentQuestion && availableQuestions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col gap-2 items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <p className="text-gray-600">No questions available</p>
        <Button
          variant="outline"
          onClick={() => navigate(`/levels/${level?.subjectId}`)}
        >
          Back to levels
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#ecfbff]">
        <div className="flex p-4 items-center justify-between px-6">
          <div
            className="text-3xl text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={handleExit}
          >
            <XCircle className="w-8 h-8" />
          </div>
          {currentQuestionResponse === null && (
            <Timer seconds={questionTimerInSeconds} />
          )}
        </div>
        <div className="text-center mb-2">
          <h1 className="font-bold text-blue-700 text-2xl">
            {subject?.subjectName.toUpperCase()}
          </h1>
        </div>

        {currentQuestion && (
          <QuestionPage
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
            totalQuestions={MAX_QUESTIONS_PER_LEVEL}
            currentLevel={level}
            currentPointsInLevel={totalPointsInLevel}
            questionResponse={currentQuestionResponse}
            onNext={onNext}
            currentQuestionTimerInSeconds={questionTimerInSeconds}
            currentQuestionNumber={questionNumber}
            correctAnswerData={correctAnswerData || null}
          />
        )}
      </div>

      <AlertDialog open={showExitAlert} onOpenChange={setShowExitAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to exit?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress in this level will be lost. This action cannot be
              undone.
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
  );
}
