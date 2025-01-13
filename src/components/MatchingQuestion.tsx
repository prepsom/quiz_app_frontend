import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeftRight, ArrowDown } from 'lucide-react';
import { QuestionResponseType } from '@/types';

interface MatchingPair {
  id: string;
  leftItem: string;
  rightItem: string;
}

interface MatchingQuestionProps {
  pairs: MatchingPair[];
  onMatch: (matches: { leftItem: string; rightItem: string }[]) => void;
  questionResponse: QuestionResponseType | null;
  correctPairs?: { leftItem: string; rightItem: string; }[];
}

export default function MatchingQuestion({
  pairs,
  onMatch,
  questionResponse,
  correctPairs
}: MatchingQuestionProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Map<string, string>>(new Map());
  const [rightItems, setRightItems] = useState<string[]>([]);

  // Generate distinct pastel colors for each pair
  const colors = [
    { bg: "bg-pink-50 hover:bg-pink-100", ring: "ring-pink-300", border: "border-pink-300" },
    { bg: "bg-purple-50 hover:bg-purple-100", ring: "ring-purple-300", border: "border-purple-300" },
    { bg: "bg-blue-50 hover:bg-blue-100", ring: "ring-blue-300", border: "border-blue-300" },
    { bg: "bg-green-50 hover:bg-green-100", ring: "ring-green-300", border: "border-green-300" },
    { bg: "bg-yellow-50 hover:bg-yellow-100", ring: "ring-yellow-300", border: "border-yellow-300" },
    { bg: "bg-orange-50 hover:bg-orange-100", ring: "ring-orange-300", border: "border-orange-300" },
    { bg: "bg-red-50 hover:bg-red-100", ring: "ring-red-300", border: "border-red-300" },
    { bg: "bg-cyan-50 hover:bg-cyan-100", ring: "ring-cyan-300", border: "border-cyan-300" },
    { bg: "bg-teal-50 hover:bg-teal-100", ring: "ring-teal-300", border: "border-teal-300" },
    { bg: "bg-lime-50 hover:bg-lime-100", ring: "ring-lime-300", border: "border-lime-300" },
  ];
  
  
  useEffect(() => {
    const shuffled = [...pairs]
      .map(p => p.rightItem)
      .sort(() => Math.random() - 0.5);
    setRightItems(shuffled);
  }, [pairs]);

  useEffect(() => {
    const matchArray = Array.from(matches.entries()).map(([left, right]) => ({
      leftItem: left,
      rightItem: right
    }));
    onMatch(matchArray);
  }, [matches, onMatch]);

  const handleItemClick = (item: string, isLeft: boolean) => {
    if (questionResponse) return;
    
    if (isLeft) {
      setSelectedLeft(prev => prev === item ? null : item);
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
    return pairs.findIndex(pair => pair.leftItem === leftItem);
  };

  const getMatchColorByRight = (rightItem: string): number => {
    const matchedLeft = Array.from(matches.entries()).find(([_, right]) => right === rightItem)?.[0];
    return matchedLeft ? getMatchIndex(matchedLeft) : -1;
  };

  const getItemStatus = (item: string, isLeft: boolean) => {
    if (!questionResponse) return 'default';
    
    if (isLeft) {
      const matchedRight = matches.get(item);
      if (!matchedRight) return 'default';
      return isCorrect(item, matchedRight) ? 'correct' : 'incorrect';
    } else {
      const matchedLeft = Array.from(matches.entries()).find(([_, right]) => right === item)?.[0];
      if (!matchedLeft) return 'default';
      return isCorrect(matchedLeft, item) ? 'correct' : 'incorrect';
    }
  };

  const isCorrect = (leftItem: string, rightItem: string) => {
    if (!correctPairs) return false;
    return correctPairs.some(pair => pair.leftItem === leftItem && pair.rightItem === rightItem);
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* Left items column */}
      <div className="space-y-3">
        {pairs.map((pair, index) => {
          const colorIndex = index % colors.length;
          const isMatched = matches.has(pair.leftItem);
          return (
            <Button
              key={pair.id}
              onClick={() => handleItemClick(pair.leftItem, true)}
              className={`w-full justify-start p-3 text-sm transition-all duration-200 ${
                selectedLeft === pair.leftItem
                  ? `ring-2 ${colors[colorIndex].ring} ${colors[colorIndex].bg}`
                  : isMatched
                  ? questionResponse
                    ? getItemStatus(pair.leftItem, true) === 'correct'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                    : `${colors[colorIndex].bg} ${colors[colorIndex].border}`
                  : 'hover:bg-gray-50'
              }`}
              variant="outline"
            >
              {pair.leftItem}
            </Button>
          );
        })}
      </div>

      {/* Arrow separator */}
      <div className="flex justify-center py-2">
        <ArrowDown className="w-6 h-6 text-gray-400" />
      </div>

      {/* Right items column */}
      <div className="space-y-3">
        {rightItems.map((rightItem) => {
          const matchIndex = getMatchColorByRight(rightItem);
          const colorIndex = matchIndex % colors.length;
          const isMatched = Array.from(matches.values()).includes(rightItem);
          return (
            <Button
              key={rightItem}
              onClick={() => handleItemClick(rightItem, false)}
              className={`w-full justify-start p-3 text-sm transition-all duration-200 ${
                isMatched
                  ? questionResponse
                    ? getItemStatus(rightItem, false) === 'correct'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                    : `${colors[colorIndex].bg} ${colors[colorIndex].border}`
                  : selectedLeft
                  ? 'hover:bg-gray-50 hover:ring-2 hover:ring-gray-200'
                  : 'hover:bg-gray-50'
              }`}
              variant="outline"
            >
              {rightItem}
            </Button>
          );
        })}
      </div>

      {/* Feedback section */}
      {questionResponse && !questionResponse.isCorrect && correctPairs && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Correct Matches:</h4>
          <div className="space-y-2">
            {correctPairs.map((pair, index) => (
              <div key={index} className="grid grid-cols-1 gap-2">
                <div className="p-2 bg-green-50 rounded border border-green-100">
                  {pair.leftItem}
                </div>
                <div className="p-2 bg-green-50 rounded border border-green-100">
                  {pair.rightItem}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}