import { useLevelsByIds } from "@/hooks/useLevelsByIds";
import { Book, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import mathsImageIcon from "../assets/MathImageIcon.png";
import scienceImageIcon from "../assets/ScienceImageIcon.png";
import computerImageIcon from "../assets/ComputerImageIcon.png";
import aiImageIcon from "../assets/AiIcon.png";
import englishIcon from "../assets/englishIcon.png";
import { MAX_QUESTIONS_PER_LEVEL } from "@/Pages/LevelPage";
import { useNavigate } from "react-router-dom";
import { useAllCompletedLevels } from "@/hooks/useAllCompletedLevels";

const subjectImageIcons = {
  mathematics: mathsImageIcon,
  science: scienceImageIcon,
  computer: computerImageIcon,
  "artificial intelligence": aiImageIcon,
  english: englishIcon,
} as const;

const IncompleteLevels = () => {
  const navigate = useNavigate();
  const [incompletedLevelsIds, setIncompletedLevelIds] = useState<string[]>([]);
  const { levels, isLoading: isLevelsLoading } =
    useLevelsByIds(incompletedLevelsIds);
  const { completedLevels, isLoading: isCompletedLevelsLoading } =
    useAllCompletedLevels();

  useEffect(() => {
    for (let index = 0; index < localStorage.length; index++) {
      if (localStorage.key(index) === "firstTimeLogin") {
        continue;
      }
      const incompleteLevelId = localStorage.key(index)!;
      setIncompletedLevelIds((prev) => [...prev, incompleteLevelId!]);
    }
  }, []);

  if (isLevelsLoading || isCompletedLevelsLoading) {
    return (
      <>
        <div className="flex items-center justify-center mt-14">
          <Loader />
        </div>
      </>
    );
  }

  if (
    levels.filter(
      (level) => !completedLevels.map((c) => c.id).includes(level.id)
    ).length === 0
  )
    return <></>;

  return (
    <>
      <div className="p-4 flex items-center my-2 text-2xl font-semibold text-gray-700">
        In progress Levels
      </div>
      <div className="flex flex-col gap-2 px-4">
        {levels
          .filter(
            (level) => !completedLevels.map((c) => c.id).includes(level.id)
          )
          .map((level) => {
            const Icon =
              subjectImageIcons[
                level.subject?.subjectName
                  ?.trim()
                  .toLowerCase() as keyof typeof subjectImageIcons
              ] || Book;

            const answeredQuestionIdsInLevel = JSON.parse(
              localStorage.getItem(level.id) || "[]"
            ) as string[];

            if (answeredQuestionIdsInLevel.length === 0) {
              return <div key={level.id}></div>;
            }

            return (
              <div
                onClick={() => navigate(`/level/${level.id}`)}
                key={level.id}
                className="flex items-center justify-start p-4 border-2 rounded-lg shadow-md gap-4"
              >
                <div className="flex items-center gap-2">
                  {typeof Icon === "string" ? (
                    <>
                      {" "}
                      <img className="w-12 h-12" src={Icon} alt="" />
                    </>
                  ) : (
                    <Icon className="w-6 h-6 text-blue-500" />
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-wrap font-medium">
                    {level.levelName}
                  </div>
                  <div className="flex flex-wrap text-sm text-gray-500">
                    {answeredQuestionIdsInLevel.length} of{" "}
                    {MAX_QUESTIONS_PER_LEVEL} Questions
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default IncompleteLevels;
