import { useCompletedLevels } from "@/hooks/useCompletedLevels";
import { Loader } from "lucide-react";
import LevelWithMetaDataCard from "./LevelWithMetaDataCard";
import { useState } from "react";
import Pagination from "./Pagination";

const UsersCompletedLevels = () => {
  const COMPLETED_LEVELS_PER_PAGE = 10;
  const [page, setPage] = useState<number>(1);
  const { completedLevelsWithMetaData, isLoading, noOfPages } =
    useCompletedLevels(page, COMPLETED_LEVELS_PER_PAGE);

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      </>
    );
  }

  if (completedLevelsWithMetaData.length === 0) {
    return (
      <>
        <div className="mt-8 font-medium flex items-center justify-center">
          No completed levels
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
        {noOfPages > 1 && (
          <Pagination
            noOfPages={noOfPages}
            currentPage={page}
            setCurrentPage={setPage}
          />
        )}
      </div>
    </>
  );
};

export default UsersCompletedLevels;
