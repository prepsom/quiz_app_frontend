import { useLeaderBoard } from "@/hooks/useLeaderBoard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Medal, Trophy } from "lucide-react";
import { useContext, useState } from "react";
import Pagination from "@/components/Pagination";
import { useSubjectsByGrade } from "@/hooks/useSubjectsByGrade";
import { AppContext } from "@/Context/AppContext";
import { AppContextType } from "@/types";
import { Navigate } from "react-router-dom";
import { SubjectCard } from "@/components/SubjectCard";
import coins3DIcon from "../assets/3DCoinsIcon.png";

const USERS_PER_PAGE = 10;

const LeaderBoardPage = () => {
  const { loggedInUser } = useContext(AppContext) as AppContextType;
  if (loggedInUser === null) return <Navigate to="/" />;
  const [page, setPage] = useState<number>(1);
  const { usersWithTotalPoints, isLoading, noOfPages } = useLeaderBoard(
    page,
    USERS_PER_PAGE
  );
  const { subjects, isLoading: isSubjectsLoading } = useSubjectsByGrade(
    loggedInUser.gradeId
  );

  if (isLoading || isSubjectsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#ecfbff]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500"; // Gold
      case 2:
        return "text-gray-400"; // Silver
      case 3:
        return "text-amber-600"; // Bronze
      default:
        return "text-gray-300";
    }
  };

  const calculateRank = (index: number) => {
    return (page - 1) * USERS_PER_PAGE + index + 1;
  };

  return (
    <div className=" bg-[#ecfbff]">
      {/* Header */}
      <div className="bg-blue-500 text-white p-10 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-3">
            <Trophy className="h-8 w-8" />
            Leaderboard
          </h1>
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        {usersWithTotalPoints.map((userWithPoints, index) => {
          const rank = calculateRank(index);
          return (
            <div
              key={userWithPoints.user.id}
              className="flex items-center gap-4 p-6  last:border-0 hover:bg-blue-50/50 transition-colors"
            >
              <div className="flex items-center gap-6 flex-1">
                <div className="text-blue-600 font-semibold">{index + 1}</div>
                <div className="w-12 flex justify-center">
                  {rank <= 3 ? (
                    <Medal className={`h-6 w-6 ${getMedalColor(rank)}`} />
                  ) : (
                    <span className="text-lg font-semibold text-gray-500">
                      {rank}
                    </span>
                  )}
                </div>
                <Avatar className="h-12 w-12 ring-2 ring-blue-100 ring-offset-2">
                  <AvatarImage
                    src={`/avatars/${userWithPoints.user.avatar.toLowerCase()}.png`}
                    alt={userWithPoints.user.name}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {userWithPoints.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-600">
                    {userWithPoints.user.name.split(" ")[0]}
                  </h3>
                </div>
                <div className="flex items-center gap-2 rounded-full px-4 py-2">
                  <img src={coins3DIcon} alt="" />
                  <span className="text-lg font-bold text-gray-900">
                    {userWithPoints.totalPoints}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            currentPage={page}
            noOfPages={noOfPages}
            setCurrentPage={setPage}
          />
        </div>
      </div>
      <div className="flex flex-col p-4 gap-2">
        <div className="text-gray-600 font-semibold text-xl mb-4">
          Learn more to get ahead
        </div>
        {subjects.slice(0, 3).map((subject) => {
          return <SubjectCard subject={subject} />;
        })}
      </div>
    </div>
  );
};

export default LeaderBoardPage;
