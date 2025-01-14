import { LevelCard } from "@/components/LevelCard";
import LevelWithMetaDataCard from "@/components/LevelWithMetaDataCard";
import { Button } from "@/components/ui/button";
import { useCompletedLevelsWithMetaDataInSubject } from "@/hooks/useCompletedLevelWithMetaDataInSubject";
import { useGetSubjectById } from "@/hooks/useGetSubjectById";
import { useLevelsBySubject } from "@/hooks/useLevelsBySubject";
import { LevelType } from "@/types";
import { ArrowLeft, Loader } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProfileLevelsPage = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();
  const { subject, isLoading: isSubjectLoading } = useGetSubjectById(
    subjectId!
  );
  const { completedLevelsWithMetaData, isLoading: isCompletedLevelsLoading } =
    useCompletedLevelsWithMetaDataInSubject(subjectId!);
  const { levels: totalLevels, isLoading: isTotalLevelsLoading } =
    useLevelsBySubject(subjectId!);

  const incompleteLevels = useMemo(
    () =>
      totalLevels?.filter((level: LevelType) => {
        // check if level is completed , if yes then return false else return true
        const isCompleted = completedLevelsWithMetaData?.some(
          (completedLevel) => completedLevel.id === level.id
        );
        return !isCompleted;
      }),
    [totalLevels, completedLevelsWithMetaData]
  );

  const sortedIncompleteLevels = useMemo(
    () => incompleteLevels.sort((a, b) => a.position - b.position),
    [incompleteLevels]
  );
  const nextLevel = useMemo(
    () =>
      sortedIncompleteLevels.length !== 0 ? sortedIncompleteLevels[0] : null,
    [sortedIncompleteLevels]
  );

  console.log(completedLevelsWithMetaData);

  if (isCompletedLevelsLoading || isTotalLevelsLoading || isSubjectLoading) {
    return (
      <>
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-[#ecfbff]">
        <div className="flex items-center p-4 bg-blue-500 text-white">
          <h2 className="font-semibold text-2xl">{subject?.subjectName}</h2>
        </div>
        <div className="flex items-center justify-start my-4">
          <Button
            onClick={() => navigate("/profile")}
            className="text-blue-600"
            variant={"link"}
          >
            <ArrowLeft />
            Back to profile
          </Button>
        </div>
        <div className="flex flex-col gap-4 px-4">
          <div className="text-blue-600 font-semibold text-xl">
            Completed Levels
          </div>
          {completedLevelsWithMetaData?.map((completedLevelWithMetaData) => {
            return (
              <LevelWithMetaDataCard
                levelWithMetaData={completedLevelWithMetaData}
                key={completedLevelWithMetaData.id}
              />
            );
          })}
        </div>
        <div className="flex flex-col gap-4 px-4">
          <div className="text-blue-600 font-semibold text-xl">
            Incomplete Levels
          </div>
          {incompleteLevels.map((incompleteLevel, index) => {
            return (
              <LevelCard
                key={incompleteLevel.id}
                index={index + completedLevelsWithMetaData.length}
                isCompleted={false}
                isLocked={incompleteLevel.id !== nextLevel?.id}
                level={incompleteLevel}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProfileLevelsPage;
