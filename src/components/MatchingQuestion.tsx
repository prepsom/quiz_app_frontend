import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight } from "lucide-react";
import { QuestionResponseType } from "@/types";
import { AnimatePresence, motion } from "motion/react";

interface MatchingPair {
  id: string;
  leftItem: string;
  rightItem: string;
}

interface MatchingQuestionProps {
  pairs: MatchingPair[];
  onMatch: (matches: { leftItem: string; rightItem: string }[]) => void;
  questionResponse: QuestionResponseType | null;
  correctPairs?: { leftItem: string; rightItem: string }[];
}

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function MatchingQuestion({
  pairs,
  onMatch,
  questionResponse,
  correctPairs,
}: MatchingQuestionProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Map<string, string>>(new Map());
  const [rightItems, setRightItems] = useState<string[]>([]);

  // Generate distinct pastel colors for each pair
  const colors = [
    {
      bg: "bg-pink-50 hover:bg-pink-100",
      ring: "ring-pink-300",
      border: "border-pink-300",
    },
    {
      bg: "bg-purple-50 hover:bg-purple-100",
      ring: "ring-purple-300",
      border: "border-purple-300",
    },
    {
      bg: "bg-blue-50 hover:bg-blue-100",
      ring: "ring-blue-300",
      border: "border-blue-300",
    },
    {
      bg: "bg-green-50 hover:bg-green-100",
      ring: "ring-green-300",
      border: "border-green-300",
    },
    {
      bg: "bg-yellow-50 hover:bg-yellow-100",
      ring: "ring-yellow-300",
      border: "border-yellow-300",
    },
    {
      bg: "bg-orange-50 hover:bg-orange-100",
      ring: "ring-orange-300",
      border: "border-orange-300",
    },
    {
      bg: "bg-red-50 hover:bg-red-100",
      ring: "ring-red-300",
      border: "border-red-300",
    },
    {
      bg: "bg-cyan-50 hover:bg-cyan-100",
      ring: "ring-cyan-300",
      border: "border-cyan-300",
    },
    {
      bg: "bg-teal-50 hover:bg-teal-100",
      ring: "ring-teal-300",
      border: "border-teal-300",
    },
    {
      bg: "bg-lime-50 hover:bg-lime-100",
      ring: "ring-lime-300",
      border: "border-lime-300",
    },
  ];

  useEffect(() => {
    const shuffled = [...pairs]
      .map((p) => p.rightItem)
      .sort(() => Math.random() - 0.5);
    setRightItems(shuffled);
  }, [pairs]);

  useEffect(() =>
    {
      // Only update parent when matches actually change
      if (matches.size > 0) {
        const matchArray = Array.from(matches.entries()).map(([left, right]) => ({
          leftItem: left,
          rightItem: right,
        }))
        onMatch(matchArray)
      }
    }
    , [matches]);
    
    

  const handleItemClick = (item: string, isLeft: boolean) => {
    if (questionResponse) return;

    if (isLeft) {
      setSelectedLeft((prev) => (prev === item ? null : item));
    } else if (selectedLeft) {
      const newMatches = new Map(matches);
      Array.from(newMatches.entries()).forEach(([key, value]) => {
        if (key === selectedLeft || value === item) {
          newMatches.delete(key);
        }
      });
      newMatches.set(selectedLeft, item);
      setMatches(newMatches);
      setSelectedLeft(null);
    }
  };

  const getMatchIndex = (leftItem: string): number => {
    return pairs.findIndex((pair) => pair.leftItem === leftItem);
  };

  const getMatchColorByRight = (rightItem: string): number => {
    const matchedLeft = Array.from(matches.entries()).find(
      ([_, right]) => right === rightItem
    )?.[0];
    return matchedLeft ? getMatchIndex(matchedLeft) : -1;
  };

  const getItemStatus = (item: string, isLeft: boolean) => {
    if (!questionResponse) return "default";

    if (isLeft) {
      const matchedRight = matches.get(item);
      if (!matchedRight) return "default";
      return isCorrect(item, matchedRight) ? "correct" : "incorrect";
    } else {
      const matchedLeft = Array.from(matches.entries()).find(
        ([_, right]) => right === item
      )?.[0];
      if (!matchedLeft) return "default";
      return isCorrect(matchedLeft, item) ? "correct" : "incorrect";
    }
  };

  const isCorrect = (leftItem: string, rightItem: string) => {
    if (!correctPairs) return false;
    return correctPairs.some(
      (pair) => pair.leftItem === leftItem && pair.rightItem === rightItem
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-lg mx-auto space-y-6"
    >
      {/* Left items column */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {pairs.map((pair, index) => {
          const colorIndex = index % colors.length;
          const isMatched = matches.has(pair.leftItem);
          return (
            <motion.div
              key={pair.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => handleItemClick(pair.leftItem, true)}
                className={`w-full justify-start p-3 text-sm transition-all duration-200 ${
                  selectedLeft === pair.leftItem
                    ? `ring-2 ${colors[colorIndex].ring} ${colors[colorIndex].bg}`
                    : isMatched
                    ? questionResponse
                      ? getItemStatus(pair.leftItem, true) === "correct"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                      : `${colors[colorIndex].bg} ${colors[colorIndex].border}`
                    : "hover:bg-gray-50"
                }`}
                variant="outline"
              >
                {pair.leftItem}
              </Button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Arrow separator */}
      <motion.div
        className="flex justify-center py-2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <ArrowDown className="w-6 h-6 text-gray-400" />
      </motion.div>

      {/* Right items column */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {rightItems.map((rightItem) => {
          const matchIndex = getMatchColorByRight(rightItem);
          const colorIndex = matchIndex % colors.length;
          const isMatched = Array.from(matches.values()).includes(rightItem);
          return (
            <motion.div
              key={rightItem}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => handleItemClick(rightItem, false)}
                className={`w-full justify-start p-3 text-sm transition-all duration-200 ${
                  isMatched
                    ? questionResponse
                      ? getItemStatus(rightItem, false) === "correct"
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                      : `${colors[colorIndex].bg} ${colors[colorIndex].border}`
                    : selectedLeft
                    ? "hover:bg-gray-50 hover:ring-2 hover:ring-gray-200"
                    : "hover:bg-gray-50"
                }`}
                variant="outline"
              >
                {rightItem}
              </Button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Feedback section */}
      <AnimatePresence>
        {questionResponse && !questionResponse.isCorrect && correctPairs && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-6 bg-white rounded-lg shadow-md border border-gray-200"
          >
            <h4 className="font-semibold text-lg text-gray-800 mb-4">
              Correct Matches
            </h4>
            <div className="space-y-4">
              {correctPairs.map((pair, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className="flex-1 p-3 bg-blue-50 rounded-md border border-blue-200 text-blue-700">
                    {pair.leftItem}
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                  <div className="flex-1 p-3 bg-green-50 rounded-md border border-green-200 text-green-700">
                    {pair.rightItem}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
