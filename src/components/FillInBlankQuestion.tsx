import { Input } from "@/components/ui/input";
import { QuestionResponseType } from "@/types";
import { useEffect, useMemo } from "react";

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

export default function FillInBlankQuestion({
  segments,
  answers,
  setAnswers,
  questionResponse,
  correctAnswers
}: FillInBlankQuestionProps) {
  // Pre-calculate blank indices to maintain stability
  const blankIndices = useMemo(() => {
    const indices: number[] = [];
    segments.forEach((segment, index) => {
      if (segment.isBlank) {
        indices.push(indices.length);
      }
    });
    return indices;
  }, [segments]);

  useEffect(() => {
    if (!answers || answers.length === 0) {
      const initialAnswers = blankIndices.map(index => ({
        blankIndex: index,
        value: ''
      }));
      setAnswers(initialAnswers);
    }
  }, [segments, answers, setAnswers, blankIndices]);

  const handleAnswerChange = (blankIndex: number, value: string) => {
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      const existingIndex = newAnswers.findIndex(a => a.blankIndex === blankIndex);
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
    if (!questionResponse) return 'default';
    const answer = answers.find(a => a.blankIndex === blankIndex);
    if (!answer) return 'default';
    return isCorrect(blankIndex, answer.value) ? 'correct' : 'incorrect';
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="text-base sm:text-lg leading-relaxed flex flex-wrap gap-2 items-baseline">
        {segments.map((segment,segmentIndex) => {
          const isBlank = segment.isBlank;
          const blankIndex = isBlank ? blankIndices[segments.slice(0, segmentIndex).filter(s => s.isBlank).length] : -1;

          if (isBlank) {
            return (
              <div key={segment.id} className="relative inline-flex flex-col min-w-[120px] sm:min-w-[160px]">
                <Input
                  type="text"
                  value={answers.find(a => a.blankIndex === blankIndex)?.value || ''}
                  onChange={(e) => handleAnswerChange(blankIndex, e.target.value)}
                  placeholder={`Answer ${blankIndex + 1}`}
                  disabled={!!questionResponse}
                  aria-label={`Blank ${blankIndex + 1}`}
                  className={`w-full p-1 sm:p-2 text-base transition-all duration-200 ${
                    questionResponse
                      ? getInputStatus(blankIndex) === 'correct'
                        ? "bg-green-50 border-green-200 text-green-900"
                        : "bg-red-50 border-red-200 text-red-900"
                      : "bg-white focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
                <span 
                  className={`absolute -top-5 left-0 text-xs sm:text-sm ${
                    questionResponse
                      ? getInputStatus(blankIndex) === 'correct'
                        ? "text-green-600"
                        : "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  Blank {blankIndex + 1}
                </span>
              </div>
            );
          }

          return (
            <span key={segment.id} className="text-gray-700">
              {segment.text}
            </span>
          );
        })}
      </div>
      
      {questionResponse && correctAnswers && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Correct Answers:</h4>
          <div className="space-y-2">
            {Object.entries(correctAnswers).map(([index, answers]) => (
              <div key={index} className="text-sm">
                <span className="font-medium text-gray-700">Blank {parseInt(index) + 1}:</span>{' '}
                <span className="text-gray-600">{answers.join(' or ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

