import { LevelCard } from "@/components/LevelCard";
import { useCompletedLevelsBySubject } from "@/hooks/useCompletedLevelsBySubject";
import { useGetSubjectById } from "@/hooks/useGetSubjectById";
import { useLevelsBySubject } from "@/hooks/useLevelsBySubject";
import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useUsersTotalPoints } from "@/hooks/useUsersTotalPoints";
import coins3DIcon from "../assets/3DCoinsIcon.png";

const LevelsPage = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();
  if (!subjectId) return <div>No subject selected</div>;
  const { totalPoints: usersTotalPoints, isLoading: isUsersPointsLoading } =
    useUsersTotalPoints();
  const { subject, isLoading: isSubjectLoading } = useGetSubjectById(subjectId);
  const { completedLevels, isLoading: isCompletedLevelsLoading } =
    useCompletedLevelsBySubject(subjectId);
  const { levels, isLoading } = useLevelsBySubject(subjectId);

  // Organize levels by completion status
  const { uncompletedLevels, nextLevel } = useMemo(() => {
    if (!levels || !completedLevels)
      return { uncompletedLevels: [], nextLevel: null };

    // Get IDs of completed levels for easier lookup
    const completedLevelIds = new Set(completedLevels.map((level) => level.id));

    // Filter out uncompleted levels
    const uncompleted = levels.filter(
      (level) => !completedLevelIds.has(level.id)
    );

    // Sort by position to ensure proper order
    uncompleted.sort((a, b) => a.position - b.position);

    // Next level is the first uncompleted level
    const nextLevel = uncompleted[0] || null;

    return { uncompletedLevels: uncompleted, nextLevel };
  }, [levels, completedLevels]);

  if (
    isLoading ||
    isSubjectLoading ||
    isCompletedLevelsLoading ||
    isUsersPointsLoading
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <p className="text-red-500">Subject not found</p>
      </div>
    );
  }

  const currentLevel = nextLevel?.position
    ? nextLevel.position + 1
    : completedLevels.length + 1;

  return (
    <div className="bg-[#ecfbff] min-h-screen">
      {/* Header */}
      <div className="p-6 flex items-center justify-between text-white bg-blue-500 mb-4">
        <h1 className="text-2xl font-bold">
          {subject.subjectName} (Level - {currentLevel})
        </h1>
      </div>

      {/* Score Display */}
      <div className="px-6 mb-6 flex justify-between">
        <button
          onClick={() => navigate("/subjects")}
          className="flex items-center gap-2 text-blue-500"
        >
          <ArrowLeft />
          <span>Subjects</span>
        </button>
        <div className="bg-[#cbeff9] rounded-full px-4 py-1 flex items-center gap-2">
          <span className="text-blue-600 font-semibold">
            {usersTotalPoints}
          </span>
          <div className="bg-purple-500 rounded-full p-1">
            {" "}
            <img src={coins3DIcon} alt="" />{" "}
          </div>
        </div>
      </div>

      {/* Levels List */}
      <div className="rounded-t-3xl  p-6">
        {completedLevels.length !== 0 || uncompletedLevels.length !== 0 ? (
          <div className="max-w-md mx-auto space-y-8">
            {/* Completed Levels */}
            {completedLevels.map((level, index) => (
              <LevelCard
                index={index}
                key={level.id}
                level={level}
                isLocked={false}
                isCompleted={true}
              />
            ))}

            {/* Uncompleted Levels */}
            {uncompletedLevels.map((level, index) => (
              <LevelCard
                index={index + completedLevels.length}
                key={level.id}
                level={level}
                isLocked={index===0 ? false : true} // Only unlock the next level
                isCompleted={false}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="flex text-2xl font-semibold text-gray-700 items-center justify-center mt-48">
              This subject has no levels
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LevelsPage;
