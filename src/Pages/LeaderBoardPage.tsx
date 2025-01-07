import { useLeaderBoard } from "@/hooks/useLeaderBoard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Medal, Trophy } from 'lucide-react'
import { useContext, useState } from "react"
import Pagination from "@/components/Pagination"
import { Card } from "@/components/ui/card"
import { useSubjectsByGrade } from "@/hooks/useSubjectsByGrade"
import { AppContext } from "@/Context/AppContext"
import { AppContextType } from "@/types"
import { Navigate } from "react-router-dom"
import { SubjectCard } from "@/components/SubjectCard"

const USERS_PER_PAGE = 10

const LeaderBoardPage = () => {
  const {loggedInUser} = useContext(AppContext) as AppContextType;
  if(loggedInUser===null) return <Navigate to="/"/>
  const [page, setPage] = useState<number>(1);
  const { usersWithTotalPoints, error, isLoading, noOfPages } = useLeaderBoard(page, USERS_PER_PAGE);
  const {subjects,isLoading:isSubjectsLoading} = useSubjectsByGrade(loggedInUser.gradeId);

  if (isLoading || isSubjectsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#ecfbff]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#ecfbff] text-red-500">
        {error}
      </div>
    )
  }

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500" // Gold
      case 2:
        return "text-gray-400" // Silver
      case 3:
        return "text-amber-600" // Bronze
      default:
        return "text-gray-300"
    }
  }

  const calculateRank = (index: number) => {
    return (page - 1) * USERS_PER_PAGE + index + 1
  }

  return (
    <div className="min-h-screen bg-[#ecfbff]">
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
        <Card className="overflow-hidden border-none bg-[#ecfbff]">
          {usersWithTotalPoints.map((userWithPoints, index) => {
            const rank = calculateRank(index)
            return (
              <div
                key={userWithPoints.user.id}
                className="flex items-center gap-4 p-6 border-b border-blue-100 last:border-0 hover:bg-blue-50/50 transition-colors"
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className="w-12 flex justify-center">
                    {rank <= 3 ? (
                      <Medal className={`h-6 w-6 ${getMedalColor(rank)}`} />
                    ) : (
                      <span className="text-lg font-semibold text-gray-500">{rank}</span>
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
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
                    <span className="inline-block w-5 h-5">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-yellow-500"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
                      </svg>
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {userWithPoints.totalPoints}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </Card>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination 
            currentPage={page}
            noOfPages={noOfPages}
            setCurrentPage={setPage}
          />
        </div>
      </div>
      <div className="flex flex-col p-4">
        <div className="text-gray-600 font-semibold text-xl mb-4">Learn more to get ahead</div>
        {subjects.slice(0,3).map((subject) => {
          return <SubjectCard subject={subject}/>
        })}
      </div>
    </div>
  )
}

export default LeaderBoardPage

