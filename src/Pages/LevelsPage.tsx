import { LevelCard } from '@/components/LevelCard'
import { useCompletedLevelsBySubject } from '@/hooks/useCompletedLevelsBySubject'
import { useGetSubjectById } from '@/hooks/useGetSubjectById'
import { useLevelsBySubject } from '@/hooks/useLevelsBySubject'
import { Loader2, BookOpen, ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContextType} from '@/types'
import { useContext, useMemo } from 'react'
import { AppContext } from '@/Context/AppContext'
import { Button } from '@/components/ui/button'
import { useUsersTotalPoints } from '@/hooks/useUsersTotalPoints'

const LevelsPage = () => {

  const navigate = useNavigate();
  const { subjectId } = useParams<{subjectId: string}>()
  if (!subjectId) return <div>No subject selected</div>
  const {totalPoints:usersTotalPoints,isLoading:isUsersPointsLoading,error:usersPointsError} = useUsersTotalPoints();
  const { subject, error, isLoading: isSubjectLoading } = useGetSubjectById(subjectId)
  const { completedLevels, error: completedLevelsError, isLoading: isCompletedLevelsLoading } = useCompletedLevelsBySubject(subjectId)
  const { levels, isLoading } = useLevelsBySubject(subjectId)

  // Organize levels by completion status
  const { uncompletedLevels, nextLevel } = useMemo(() => {
    if (!levels || !completedLevels) return { uncompletedLevels: [], nextLevel: null }

    // Get IDs of completed levels for easier lookup
    const completedLevelIds = new Set(completedLevels.map(level => level.id))

    // Filter out uncompleted levels
    const uncompleted = levels.filter(level => !completedLevelIds.has(level.id))
    
    // Sort by position to ensure proper order
    uncompleted.sort((a, b) => a.position - b.position)

    // Next level is the first uncompleted level
    const nextLevel = uncompleted[0] || null

    return { uncompletedLevels: uncompleted, nextLevel }
  }, [levels, completedLevels])

  if (isLoading || isSubjectLoading || isCompletedLevelsLoading || isUsersPointsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error || !subject || completedLevelsError || usersPointsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <p className="text-red-500">Subject not found</p>
      </div>
    )
  }

  const currentLevel = nextLevel?.position ? nextLevel.position + 1 : completedLevels.length + 1

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {/* Header */}
      <div className="p-6 flex items-center justify-between text-blue-600">
        <h1 className="text-2xl font-bold">{subject.subjectName} (Level - {currentLevel})</h1>
        <BookOpen className="w-6 h-6" />
      </div>

      {/* Score Display */}
      <div className="px-6 mb-6 flex justify-between">
        <Button onClick={() => navigate("/subjects")} variant={"default"} className='bg-blue-500 text-white hover:bg-blue-600'><ArrowLeft/>Subjects</Button>
        <div className="bg-blue-500 rounded-full px-4 py-1 text-white flex items-center gap-2">
          <span>{usersTotalPoints}</span>
          <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-xs">🪙</span>
          </div>
        </div>
      </div>

      {/* Levels List */}
      <div className="bg-white rounded-t-3xl min-h-screen p-6 shadow-lg">

        <div className="max-w-md mx-auto space-y-4">
          {/* Completed Levels */}
          {completedLevels.map((level) => (
            <LevelCard
              key={level.id}
              level={level}
              isLocked={false}
              isCompleted={true}
              currentLevel={currentLevel}
            />
          ))}

          {/* Uncompleted Levels */}
          {uncompletedLevels.map((level) => (
            <LevelCard
              key={level.id}
              level={level}
              isLocked={level.id !== nextLevel?.id} // Only unlock the next level
              isCompleted={false}
              currentLevel={currentLevel}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LevelsPage

