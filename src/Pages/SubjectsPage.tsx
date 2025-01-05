import { AppContext } from '@/Context/AppContext'
import { useSubjectsByGrade } from '@/hooks/useSubjectsByGrade'
import { AppContextType } from '@/types'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader2} from 'lucide-react'
import { SubjectCard } from '@/components/SubjectCard'
import { useUsersTotalPoints } from '@/hooks/useUsersTotalPoints'

export default function SubjectsPage() {
  const { loggedInUser} = useContext(AppContext) as AppContextType;
  const {totalPoints:usersTotalPoints,isLoading:isUsersTotalPointsLoading,error:usersTotalPointsError} = useUsersTotalPoints();
  if (loggedInUser === null) return <Navigate to="/login" />  
  const { subjects, isLoading } = useSubjectsByGrade(loggedInUser?.gradeId);

  if (isLoading || isUsersTotalPointsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if(usersTotalPointsError) {
    return (
      <>
        <div className='flex items-center justify-center text-red-500'>
          {usersTotalPointsError}
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {/* Header */}
      <div className="bg-blue-500 p-6 flex items-center justify-between text-white">
        <h1 className="text-2xl font-bold">Your Subjects</h1>
      </div>

      {/* Score Display */}
      <div className="px-6 py-4 flex justify-end">
        <div className="bg-blue-500 rounded-full px-4 py-1 text-white flex items-center gap-2">
          <span>{usersTotalPoints}</span>
          <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-xs">🪙</span>
          </div>
        </div>
      </div>

      {/* Subjects List */}
      <div className="max-w-lg mx-auto p-4 space-y-4">
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  )
}

