import { Input } from "@/components/ui/input";
import { QuestionResponseType } from "@/types";
import { useEffect, useMemo } from "react";
import { motion } from "motion/react";

interface BlankSegment {
  id: string;
  text: string;
  isBlank: boolean;
}

interface FillInBlankQuestionProps {
  segments: BlankSegment[];
  answers: BlankAnswer[];
  setAnswers: React.Dispatch<React.SetStateAction<BlankAnswer[]>>;
  questionResponse: QuestionResponseType | null;
  correctAnswers?: Record<number, string[]>;
}

type BlankAnswer = {
  blankIndex: number;
  value: string;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export default function FillInBlankQuestion({
  segments,
  answers,
  setAnswers,
  questionResponse,
  correctAnswers,
}: FillInBlankQuestionProps) {
  // Pre-calculate blank indices to maintain stability
  const blankIndices = useMemo(() => {
    const indices: number[] = [];
    segments.forEach((segment, _) => {
      if (segment.isBlank) {
        indices.push(indices.length);
      }
    });
    return indices;
  }, [segments]);

  useEffect(() => {
    if (!answers || answers.length === 0) {
      const initialAnswers = blankIndices.map((index) => ({
        blankIndex: index,
        value: "",
      }));
      setAnswers(initialAnswers);
    }
  }, [segments, answers, setAnswers, blankIndices]);

  const handleAnswerChange = (blankIndex: number, value: string) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      const existingIndex = newAnswers.findIndex(
        (a) => a.blankIndex === blankIndex
      );
      if (existingIndex !== -1) {
        newAnswers[existingIndex] = { blankIndex, value };
      } else {
        newAnswers.push({ blankIndex, value });
      }
      return newAnswers;
    });
  };

  const isCorrect = (blankIndex: number, value: string) => {
    if (!correctAnswers || !correctAnswers[blankIndex]) return false;
    return correctAnswers[blankIndex].includes(value.toLowerCase().trim());
  };

  const getInputStatus = (blankIndex: number) => {
    if (!questionResponse) return "default";
    const answer = answers.find((a) => a.blankIndex === blankIndex);
    if (!answer) return "default";
    return isCorrect(blankIndex, answer.value) ? "correct" : "incorrect";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-lg mx-auto"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="text-base sm:text-lg leading-relaxed flex flex-wrap gap-2 items-baseline"
      >
        {segments.map((segment, segmentIndex) => {
          const isBlank = segment.isBlank;
          const blankIndex = isBlank
            ? blankIndices[
                segments.slice(0, segmentIndex).filter((s) => s.isBlank).length
              ]
            : -1;

          if (isBlank) {
            return (
              <motion.div
                variants={item}
                whileHover={{ scale: 1.02 }}
                key={segment.id}
                className="relative inline-flex flex-col min-w-[120px] sm:min-w-[160px]"
              >
                <Input
                  type="text"
                  value={
                    answers.find((a) => a.blankIndex === blankIndex)?.value ||
                    ""
                  }
                  onChange={(e) =>
                    handleAnswerChange(blankIndex, e.target.value)
                  }
                  placeholder={`Answer ${blankIndex + 1}`}
                  disabled={!!questionResponse}
                  aria-label={`${blankIndex + 1}`}
                  className={`w-full p-1 sm:p-2 text-base transition-all duration-200 ${
                    questionResponse
                      ? getInputStatus(blankIndex) === "correct"
                        ? "bg-green-50 border-green-200 text-green-900"
                        : "bg-red-50 border-red-200 text-red-900"
                      : "bg-white focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
              </motion.div>
            );
          }

          return (
            <motion.span
              key={segment.id}
              variants={item}
              className="text-gray-700"
            >
              {segment.text}
            </motion.span>
          );
        })}
      </motion.div>

      {questionResponse && correctAnswers && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <h4 className="font-medium text-gray-900 mb-2">Correct Answers:</h4>
          <div className="space-y-2">
            {Object.entries(correctAnswers).map(([index, answers]) => (
              <div key={index} className="text-sm">
                <span className="font-medium text-gray-700">
                  Answer {parseInt(index) + 1}:
                </span>{" "}
                <span className="text-gray-600">{answers.join(" or ")}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
