import { useCompletedLevels } from "@/hooks/useCompletedLevels";
import { Loader } from "lucide-react";
import LevelWithMetaDataCard from "./LevelWithMetaDataCard";
import { useContext, useEffect, useState } from "react";
import Pagination from "./Pagination";
import { useSubjectsByGrade } from "@/hooks/useSubjectsByGrade";
import { AppContext } from "@/Context/AppContext";
import { AppContextType } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const UsersCompletedLevels = () => {
  const {loggedInUser} = useContext(AppContext) as AppContextType;
  const COMPLETED_LEVELS_PER_PAGE = 10;
  const [page, setPage] = useState<number>(1);
  const {subjects,isLoading:isSubjectsLoading} = useSubjectsByGrade(loggedInUser?.gradeId!);
  const [filterBySubjectId,setFilterBySubjectId] = useState<string>("ALL");
  const { completedLevelsWithMetaData, isLoading, noOfPages } =
    useCompletedLevels(page, COMPLETED_LEVELS_PER_PAGE,filterBySubjectId==="ALL" ? undefined : filterBySubjectId);

  
  useEffect(() => setPage(1) , [filterBySubjectId]);

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
        {(subjects.length!==0 && !isSubjectsLoading ) ? <div className="flex items-center my-2">
          <div className="bg-white">
            <Select value={filterBySubjectId} onValueChange={setFilterBySubjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by subject"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                {subjects.map((subject) => {
                  return <SelectItem key={subject.id} value={subject.id}>{subject.subjectName}</SelectItem>
                })}
              </SelectContent>
            </Select>
          </div>
        </div> : (
          <>
            <Loader/>
          </>
        )}
        {completedLevelsWithMetaData.length!==0 ?  completedLevelsWithMetaData.map((completedLevel) => {
          return (
            <LevelWithMetaDataCard
              key={completedLevel.id}
              levelWithMetaData={completedLevel}
            />
          );
        }) : (
          <>
            <div className="flex items-center justify-center font-semibold">No completed levels</div>
          </>
        )}
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
