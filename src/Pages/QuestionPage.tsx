import { useState, useEffect, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  LevelType,
  QuestionResponseType,
  QuestionType,
  QuestionResponseRequestBody,
  QuestionResponseData,
} from "@/types";
import { useQuestionWithAnswers } from "@/hooks/useQuestionWithAnswers";
import MCQQuestion from "@/components/MCQQuestion";
import MatchingQuestion from "@/components/MatchingQuestion";
import FillInBlankQuestion from "@/components/FillInBlankQuestion";
import { motion } from "motion/react";
import { AlertDialog,AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import owlImage from "../assets/owl_image.png"


interface QuestionPageProps {
  question: QuestionType;
  onSubmit: (answer: QuestionResponseRequestBody) => Promise<void>;
  totalQuestions: number;
  currentLevel: LevelType | null;
  currentPointsInLevel: number;
  questionResponse: QuestionResponseType | null;
  onNext?: () => void;
  currentQuestionTimerInSeconds: number;
  currentQuestionNumber: number;
  correctAnswerData: QuestionResponseData["correctData"] | null;
  isShowGoodJob:boolean;
  setIsShowGoodJob:React.Dispatch<SetStateAction<boolean>>;
}

export default function QuestionPage({
  question,
  onSubmit,
  totalQuestions,
  currentLevel,
  questionResponse,
  onNext,
  currentQuestionTimerInSeconds,
  currentQuestionNumber,
  correctAnswerData,
  isShowGoodJob,
  setIsShowGoodJob
}: QuestionPageProps) {
  const { question: currentQuestion, isLoading: isQuestionWithAnswersLoading } =
    useQuestionWithAnswers(question.id);
  const [answer, setAnswer] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allOptionsMatched, setAllOptionsMatched] = useState(false);

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  const handleSubmit = async () => {
    if (!answer || !currentQuestion) return;
    setIsSubmitting(true);

    let responseBody: QuestionResponseRequestBody;

    switch (currentQuestion.questionType) {
      case "MCQ":
        responseBody = {
          type: "MCQ",
          questionId: currentQuestion.id,
          timeTaken: currentQuestionTimerInSeconds,
          selectedAnswerId: answer,
        };
        break;
      case "FILL_IN_BLANK":
        responseBody = {
          type: "FILL_IN_BLANK",
          questionId: currentQuestion.id,
          timeTaken: currentQuestionTimerInSeconds,
          answers: answer,
        };
        break;
      case "MATCHING":
        responseBody = {
          type: "MATCHING",
          questionId: currentQuestion.id,
          timeTaken: currentQuestionTimerInSeconds,
          pairs: answer,
        };
        break;
      default:
        throw new Error("Unsupported question type");
    }

    await onSubmit(responseBody);
    setIsSubmitting(false);
  };

  const allBlanksFilled = () => {
    if (currentQuestion?.questionType !== "FILL_IN_BLANK" || !answer)
      return true;
    return answer.every((a: any) => a.value.trim() !== "");
  };

  if (isQuestionWithAnswersLoading) {
    return (
      <div className="w-full max-w-md mx-auto px-4 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4">
      {/* Header Section */}
      <div className="flex items-center justify-center gap-2 mb-12">
        <div className="font-semibold text-blue-400 text-xl">
          LEVEL {currentLevel?.position ? currentLevel.position + 1 : 1}:
        </div>
        <div className="font-semibold text-md">{currentLevel?.levelName}</div>
      </div>

      <div className="flex justify-between items-center font-semibold my-2 text-[#36a7be]">
        <div>
          Question {currentQuestionNumber} of {totalQuestions}
        </div>
        <div>{question.difficulty}</div>
      </div>
      <motion.div className="flex flex-col items-center">
        <div className="w-full bg-white text-center flex items-center justify-center font-semibold text-lg text-gray-800 py-2 px-4 rounded-lg border-2 border-[#c4eff4]">
          {currentQuestion?.questionTitle}
        </div>

        {/* Question Content */}
        <div className="rounded-3x my-8 w-full">
          {currentQuestion?.questionType === "MCQ" && (
            <MCQQuestion
              question={currentQuestion}
              selectedAnswer={answer}
              setSelectedAnswer={setAnswer}
              questionResponse={questionResponse}
              correctAnswerId={correctAnswerData?.correctAnswerId || null}
            />
          )}
          {currentQuestion?.questionType === "MATCHING" && (
            <MatchingQuestion
              pairs={currentQuestion.MatchingPairs || []}
              onMatch={(matches) => {
                setAnswer(matches);
                setAllOptionsMatched(
                  matches.length === currentQuestion.MatchingPairs?.length
                );
              }}
              questionResponse={questionResponse}
              correctPairs={correctAnswerData?.correctPairs || []}
            />
          )}
          {currentQuestion?.questionType === "FILL_IN_BLANK" && (
            <FillInBlankQuestion
              segments={currentQuestion.BlankSegments || []}
              answers={answer || []}
              setAnswers={setAnswer}
              questionResponse={questionResponse}
              correctAnswers={correctAnswerData?.correctAnswers}
            />
          )}
        </div>
      </motion.div>

      {/* Explanation */}
      {questionResponse && question.explanation !== "" && (
        <div className="flex flex-col gap-2 my-4">
          <h2 className="text-blue-500 font-bold">EXPLANATION</h2>
          <p className="text-lg text-gray-500 font-semibold">
            {question.explanation.length > 300
              ? question.explanation.slice(0, 300) + "..."
              : question.explanation}
          </p>
        </div>
      )}

      {/* Action Button */}
      <div className="relative bottom-4 left-0 right-0 flex justify-center p-4 my-4">
        <div className="w-full max-w-md">
          {!questionResponse ? (
            <Button
              onClick={handleSubmit}
              disabled={
                !answer ||
                isSubmitting ||
                (currentQuestion?.questionType === "MATCHING" &&
                  !allOptionsMatched) ||
                (currentQuestion?.questionType === "FILL_IN_BLANK" &&
                  !allBlanksFilled())
              }
              className="w-full py-6 text-lg font-medium bg-[#1e8bf1] hover:bg-blue-600 text-white rounded-xl"
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
              Next
            </Button>
          )}
        </div>
      </div>
      <AlertDialog open={isShowGoodJob} onOpenChange={setIsShowGoodJob}>
        <AlertDialogContent className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full animate-pulse" />
              <img
                src={owlImage || "/placeholder.svg"}
                alt="Congratulations owl"
                className="w-full h-full object-contain relative z-10 drop-shadow-xl"
              />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                Excellent Work!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-blue-600/80 mt-2">
                You're on a roll! Keep up the great work and maintain your winning streak.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    
  );
}
