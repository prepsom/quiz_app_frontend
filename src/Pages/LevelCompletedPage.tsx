import type React from "react";
import { type SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { LevelCompletionResponse, LevelType } from "@/types";
import { CheckCircle, Percent, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import coin3DIcon from "../assets/3DCoinsIcon.png";
import { motion } from "motion/react";

type Props = {
  setShowLevelCompletedPage: React.Dispatch<SetStateAction<boolean>>;
  levelCompletionData: LevelCompletionResponse;
  level: LevelType;
  setCompletionStatus: React.Dispatch<
    SetStateAction<LevelCompletionResponse | null>
  >;
  setGameComplete: React.Dispatch<SetStateAction<boolean>>;
  handleNextLevel: () => void;
  nextLevel: LevelType;
};

const LevelCompletedPage = ({
  setShowLevelCompletedPage,
  levelCompletionData,
  level,
  handleNextLevel,
}: Props) => {
  const [currentTotalPoints, setCurrentTotalPoints] = useState<number>(0);
  const pointsEarnedInLevel = levelCompletionData.totalPointsEarnedInLevel!;

  useEffect(() => {
    let counter = 0;
    const interval = setInterval(() => {
      if (counter === pointsEarnedInLevel) {
        clearInterval(interval);
        return;
      }
      setCurrentTotalPoints((prev) => prev + 1);
      counter++;
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold text-blue-600">Level Completed</h1>
          <div className="text-blue-500 font-semibold text-lg">
            {level.levelName}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <img className="animate-spin" src={coin3DIcon} />
            <div className="flex items-center justify-center">
              <span className="text-3xl font-bold text-blue-600">
                {currentTotalPoints}
              </span>
            </div>
          </div>
          <Progress
            value={levelCompletionData.percentage}
            className="w-full"
            indicatorClassName="bg-blue-400"
          />
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
            onClick={() => setShowLevelCompletedPage(false)}
          >
            View Feedback
          </Button>
          <Button
            onClick={handleNextLevel}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
          >
            Next Level
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={<CheckCircle className="text-green-500" />}
            value={`${levelCompletionData.noOfCorrectQuestions} / ${levelCompletionData.totalQuestions}`}
            label="Correct Answers"
          />
          <StatCard
            icon={<Percent className="text-blue-500" />}
            value={`${levelCompletionData.percentage?.toFixed(2)!}%`}
            label="Accuracy"
          />
          <StatCard
            icon={<Award className="text-yellow-400" />}
            value={pointsEarnedInLevel}
            label="Points Earned"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) => (
  <motion.div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center justify-center space-y-2">
    {icon}
    <div className="font-bold text-lg">{value}</div>
    <div className="text-sm text-gray-600 text-center">{label}</div>
  </motion.div>
);

export default LevelCompletedPage;
