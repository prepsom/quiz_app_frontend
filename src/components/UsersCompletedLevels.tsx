import { useCompletedLevels } from "@/hooks/useCompletedLevels";
import { Loader } from "lucide-react";
import LevelWithMetaDataCard from "./LevelWithMetaDataCard";

const UsersCompletedLevels = () => {
  const { completedLevelsWithMetaData, isLoading } = useCompletedLevels();

  if (isLoading) {
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
      <div className="flex flex-col gap-4">
        {completedLevelsWithMetaData.map((completedLevel) => {
          return (
            <LevelWithMetaDataCard
              key={completedLevel.id}
              levelWithMetaData={completedLevel}
            />
          );
        })}
      </div>
    </>
  );
};

export default UsersCompletedLevels;
