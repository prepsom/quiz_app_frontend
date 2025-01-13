import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, XCircle } from "lucide-react";
import { QuestionResponseType } from "@/types";
import { motion } from "framer-motion";

interface MCQQuestionProps {
  question: any;
  selectedAnswer: string;
  setSelectedAnswer: (value: string) => void;
  questionResponse: QuestionResponseType | null;
  correctAnswerId: string | null;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { x: -100, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

export default function MCQQuestion({
  question,
  selectedAnswer,
  setSelectedAnswer,
  questionResponse,
  correctAnswerId,
}: MCQQuestionProps) {
  return (
    <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {question?.MCQAnswers?.map((answer: any) => {
          const isSelected = questionResponse
            ? questionResponse.chosenAnswerId === answer.id
            : selectedAnswer === answer.id;
          const showResult = questionResponse !== null;
          const isChosenAnswer = questionResponse?.chosenAnswerId === answer.id;
          const isCorrectAnswer = correctAnswerId
            ? correctAnswerId === answer.id
            : false;

          return (
            <motion.div
              variants={item}
              key={answer.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center w-full"
                >
                  {isCorrectAnswer && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                      }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    </motion.div>
                  )}
                  {isChosenAnswer && !questionResponse.isCorrect && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                      }}
                    >
                      <XCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                    </motion.div>
                  )}
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
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </RadioGroup>
  );
}
