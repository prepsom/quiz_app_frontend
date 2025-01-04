import { useLeaderBoard } from '@/hooks/useLeaderBoard'
import { Card, CardContent} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Medal } from 'lucide-react'

const LeaderBoardPage = () => {
  const { usersWithTotalPoints, error, isLoading } = useLeaderBoard()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    )
  }

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return 'text-yellow-500' // Gold
      case 1:
        return 'text-gray-400' // Silver
      case 2:
        return 'text-amber-600' // Bronze
      default:
        return 'text-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-500 text-white p-10">
        <h1 className="text-3xl font-bold text-center">Leaderboard</h1>
      </div>

      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-6">
            {usersWithTotalPoints
              .map((userWithPoints, index) => (
                <div
                  key={userWithPoints.user.id}
                  className="flex items-center gap-4 py-4 border-b border-dotted last:border-0"
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-8 text-2xl font-bold text-gray-500">
                      {index <= 2 ? (
                        <Medal className={`h-6 w-6 ${getMedalColor(index)}`} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`/avatars/${userWithPoints.user.avatar.toLowerCase()}.png`}
                        alt={userWithPoints.user.name}
                      />
                      <AvatarFallback>
                        {userWithPoints.user.name
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {userWithPoints.user.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
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
                      <span className="text-lg font-semibold text-gray-900">
                        {userWithPoints.totalPoints}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LeaderBoardPage;


