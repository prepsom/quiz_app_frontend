import { LevelType, QuestionResponseType, QuestionType } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useQuestionWithAnswers } from "@/hooks/useQuestionWithAnswers";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuestionPageProps {
  question: QuestionType;
  onSubmit: (answerId: string, responseTimeInSeconds: number) => Promise<void>;
  totalQuestions: number;
  currentLevel: LevelType | null;
  currentPointsInLevel: number;
  questionResponse: QuestionResponseType | null;
  onNext?: () => void;
  currentQuestionTimerInSeconds: number;
  currentQuestionNumber: number;
  correctAnswerId:string | null;
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
  correctAnswerId
}: QuestionPageProps) {
  const { question: currentQuestion, isLoading: isQuestionWithAnswersLoading } =
    useQuestionWithAnswers(question.id);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSelectedAnswer("");
  }, [question]);

  const handleSubmit = async (responseTimeInSeconds: number) => {
    if (!selectedAnswer) return;
    setIsSubmitting(true);
    await onSubmit(selectedAnswer, responseTimeInSeconds);
    setIsSubmitting(false);
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

      <div className="flex justify-start items-center font-semibold my-2 text-[#36a7be]">
        Question {currentQuestionNumber} of {totalQuestions}
      </div>
      <div className="flex flex-col items-center">
        <div className="w-full bg-white text-center flex items-center justify-center font-semibold text-lg text-gray-800 py-2 px-4 rounded-lg border-2 border-[#c4eff4]">
          {currentQuestion?.questionTitle}
        </div>

        {/* Question Card */}
        <div className="rounded-3x my-8 w-full ">
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
            <div className="space-y-3">
              {currentQuestion?.Answers?.map((answer) => {
                const isSelected = questionResponse
                  ? questionResponse.chosenAnswerId === answer.id
                  : selectedAnswer === answer.id;
                const showResult = questionResponse !== null;
                const isChosenAnswer =
                  questionResponse?.chosenAnswerId === answer.id;        
                
                const isCorrectAnswer = correctAnswerId ? correctAnswerId===answer.id : false;
                  
                return (
                  <div
                    key={answer.id}
                    className={`
                      relative flex items-center p-4 rounded-xl transition-colors
                      ${
                        showResult
                          ? isCorrectAnswer
                            ? "bg-green-100 border-green-200 border-2"
                            : isChosenAnswer && !questionResponse?.isCorrect
                            ? "bg-red-100 border-red-200 border-2"
                            : "bg-gray-50"
                          : isSelected
                          ? "bg-blue-50 border-blue-200 border-2"
                          : "bg-white shadow-sm hover:bg-gray-100"
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
                        <span
                          className={`${
                            isSelected ? "text-blue-500" : "text-gray-700"
                          }`}
                        >
                          {answer.value}
                        </span>
                      </label>
                    ) : (
                      <div className="flex items-center w-full">

                        {isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />}
                        {(isChosenAnswer && !questionResponse.isCorrect) && <XCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" /> }
                        {!isChosenAnswer && !isCorrectAnswer && (
                          <div className="border-2 rounded-full mr-4 p-2"></div>
                        )}
                        <span
                          className={`
                            ${
                              isCorrectAnswer
                                ? "text-green-700"
                                : isChosenAnswer && !questionResponse?.isCorrect
                                ? "text-red-700"
                                : "text-gray-700"
                            }
                          `}
                        >
                          {answer.value}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Result Display */}
      {questionResponse && question.explanation !== "" && (
        <>
          <div className="flex flex-col gap-2 my-4">
            <h2 className="text-blue-500  font-bold">EXPLANATION</h2>
            <p className="text-lg text-gray-500 font-semibold">
              {question.explanation.length > 300
                ? question.explanation.slice(0, 300)[0] + "..."
                : question.explanation}
            </p>
          </div>
        </>
      )}

      {/* Action Button */}
      <div className="relative bottom-4 left-0 right-0 flex justify-center p-4 my-4">
        <div className="w-full max-w-md">
          {!questionResponse ? (
            <Button
              onClick={() => handleSubmit(currentQuestionTimerInSeconds)}
              disabled={!selectedAnswer || isSubmitting}
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
    </div>
  );
}
