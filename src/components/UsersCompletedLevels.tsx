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
        <Pagination
          noOfPages={noOfPages}
          currentPage={page}
          setCurrentPage={setPage}
        />
      </div>
    </>
  );
};

export default UsersCompletedLevels;
