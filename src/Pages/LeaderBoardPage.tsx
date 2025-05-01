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
    <div className="bg-[#ecfbff] min-h-screen">
      {/* Header */}
      <div className="bg-blue-500 text-white p-8 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-3">
            <Trophy className="h-8 w-8" />
            Leaderboard
          </h1>
        </div>
      </div>

      {/* Leaderboard Content */}
      <div className="container mx-auto py-6 px-4 max-w-2xl">
        {usersWithTotalPoints.map((userWithPoints, index) => {
          const rank = calculateRank(index);
          return (
            <div
              key={userWithPoints.user.id}
              className="grid grid-cols-[48px_auto_100px] items-center py-4 px-6 hover:bg-blue-50/50 transition-colors rounded-lg"
            >
              {/* Rank/Medal Column */}
              <div className="flex justify-center">
                {rank <= 3 ? (
                  <Medal className={`h-6 w-6 ${getMedalColor(rank)}`} />
                ) : (
                  <span className="text-blue-600 font-semibold">{rank}</span>
                )}
              </div>

              {/* Avatar and Name Column */}
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 ring-2 ring-blue-100 ring-offset-2">
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
                <h3 className="text-lg font-semibold text-blue-600">
                  {userWithPoints.user.name.split(" ")[0]}
                </h3>
              </div>

              {/* Points Column */}
              <div className="flex items-center justify-end gap-2">
                <img src={coins3DIcon} alt="" className="w-5 h-5" />
                <span className="text-lg font-bold text-gray-900 min-w-[40px] text-right">
                  {userWithPoints.totalPoints}
                </span>
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

      {/* Subjects Section */}
      <div className="container mx-auto px-4 max-w-2xl pb-8">
        <div className="text-gray-600 font-semibold text-xl mb-4">
          Learn more to get ahead
        </div>
        <div className="space-y-3">
          {subjects.slice(0, 3).map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderBoardPage;
