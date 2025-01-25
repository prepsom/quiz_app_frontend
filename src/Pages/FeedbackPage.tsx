import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AppContext } from "@/Context/AppContext";
import { useNextLevel } from "@/hooks/useNextLevel";
import { AppContextType, LevelCompletionResponse, LevelType } from "@/types";
import { SetStateAction, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import LevelCompletedPage from "./LevelCompletedPage";

type Props = {
  levelCompletionData: LevelCompletionResponse;
  level: LevelType;
  setGameComplete: React.Dispatch<SetStateAction<boolean>>;
  setCompletionStatus: React.Dispatch<
    SetStateAction<LevelCompletionResponse | null>
  >;
};
const FeedbackPage = ({
  levelCompletionData,
  level,
  setCompletionStatus,
  setGameComplete,
}: Props) => {
  const navigate = useNavigate();
  const { loggedInUser } = useContext(AppContext) as AppContextType;
  const { nextLevel, isLoading: isNextLevelLoading } = useNextLevel(level.id);
  const [showLevelCompletedPage, setShowLevelCompletedPage] = useState<boolean>(
    levelCompletionData.isComplete!
  );
  // game complete status , completionStatus

  const handleNextLevel = () => {
    if (nextLevel == null) return;
    setGameComplete(false);
    setCompletionStatus(null);
    navigate(`/level/${nextLevel.id}`);
  };

  if (showLevelCompletedPage) {
    return (
      <LevelCompletedPage
        setShowLevelCompletedPage={setShowLevelCompletedPage}
        levelCompletionData={levelCompletionData}
        level={level}
        setGameComplete={setGameComplete}
        setCompletionStatus={setCompletionStatus}
      />
    );
  }

  return (
    <>
      {/* when user answers all questions in a level and comes to this feedback page , before feedback if the user has completed level , show the points adding up to the total score */}
      <div className="min-h-screen flex flex-col items-center">
        <div className="p-6 bg-blue-500 text-white w-full flex justify-center">
          <div className="text-2xl font-bold">Performance Report</div>
        </div>

        <div className="flex flex-col w-full px-4 max-w-3xl">
          <div className="flex items-center gap-4 my-4 justify-between w-full">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 ring-2 ring-blue-100 ring-offset-2">
                <AvatarImage
                  src={`/avatars/${loggedInUser?.avatar.toLowerCase()}.png`}
                  alt={loggedInUser?.name}
                />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {loggedInUser?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-blue-500 font-semibold text-xl">
                {loggedInUser?.name}
              </div>
            </div>
            <div>
              <Button
                variant={"outline"}
                onClick={() => navigate(`/levels/${level.subjectId}`)}
              >
                Back to levels
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="tracking-wide text-blue-600">LEVEL :</span>
            <span className="text-[#374151] font-semibold">
              {level.levelName}
            </span>
          </div>

          <div className="flex flex-col gap-4 my-4 pb-20">
            <div className="border rounded-lg bg-[#ecfbff] p-4 flex flex-col w-full gap-2">
              <div className="flex items-center justify-start text-blue-500 font-semibold text-xl">
                Overall Performance
              </div>
              <div className="flex items-center flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[#6B7280]">Score Achieved</span>
                  <span className="text-[#4B5563]">
                    {levelCompletionData.percentage?.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#6B7280]">Level Passed</span>
                  <span className="text-[#4B5563]">
                    {levelCompletionData.isComplete ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              <div className="text-[#6B72803]">Remarks:</div>
              <div className="flex flex-wrap text-[#4B5563]">
                {levelCompletionData.remarks}
              </div>
            </div>

            <div className="border rounded-lg bg-[#f1ffec] p-4 flex flex-col w-full gap-2">
              <div className="flex items-center justify-start text-[#10BC58] font-semibold text-xl">
                Strengths
              </div>
              <ul className="flex flex-col items-start gap-2 list-disc px-4">
                {levelCompletionData.strengths?.map(
                  (strength: string, index: number) => (
                    <li className="text-[#4B5563]" key={index}>
                      {strength}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="border rounded-lg bg-[#feeeee] p-4 flex flex-col w-full gap-2">
              <div className="flex items-center justify-start text-[#F77367] font-semibold text-xl">
                Weaknesses
              </div>
              <ul className="flex flex-col items-start gap-2 list-disc px-4">
                {levelCompletionData.weaknesses?.map(
                  (weakness: string, index: number) => (
                    <li className="text-[#4B5563]" key={index}>
                      {weakness}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="border rounded-lg bg-[#ecfbff] p-4 flex flex-col w-full gap-2">
              <div className="flex items-center justify-start text-[#3779F6] font-semibold text-xl">
                Recommendations
              </div>
              <ul className="flex flex-col items-start gap-2 list-disc px-4">
                {levelCompletionData.recommendations?.map(
                  (recommendation: string, index: number) => (
                    <li className="text-[#4B5563]" key={index}>
                      {recommendation}
                    </li>
                  )
                )}
              </ul>
            </div>
            {levelCompletionData.isComplete &&
              nextLevel !== null &&
              !isNextLevelLoading && (
                <div className="flex items-center justify-end">
                  <Button onClick={handleNextLevel} variant="outline">
                    Next Level
                  </Button>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackPage;
