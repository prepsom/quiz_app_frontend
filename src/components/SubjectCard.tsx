import { SubjectType } from "@/types"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { Book, FlaskRoundIcon as Flask, Monitor } from 'lucide-react'
import { useLevelsBySubject } from "@/hooks/useLevelsBySubject"
import { useCompletedLevelsBySubject } from "@/hooks/useCompletedLevelsBySubject"
import { Skeleton } from "./ui/skeleton"
import { ProgressCircle } from "./ProgressCircle"

const subjectIcons = {
  'Mathematics': Book,
  'Science': Flask,
  'Computer': Monitor,
} as const

interface SubjectCardProps {
  subject: SubjectType
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const navigate = useNavigate()
  const Icon = subjectIcons[subject.subjectName as keyof typeof subjectIcons] || Book
  const { levels: totalLevels, isLoading: isTotalLevelsLoading, error: totalLevelsError } = useLevelsBySubject(subject.id)
  const { 
    completedLevels, 
    isLoading: isCompletedLevelsLoading, 
    error: completedLevelsError 
  } = useCompletedLevelsBySubject(subject.id)

  const progress = totalLevels.length > 0 
    ? Math.round((completedLevels.length / totalLevels.length) * 100) 
    : 0

  if (isTotalLevelsLoading || isCompletedLevelsLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </Card>
    )
  }

  if (completedLevelsError || totalLevelsError) {
    return (
      <Card className="p-4">
        <div className="text-red-500 flex items-center justify-center">
          {completedLevelsError || totalLevelsError}
        </div>
      </Card>
    )
  }

  return (
    <Card 
      className="p-4 hover:shadow-md transition-shadow bg-white rounded-xl cursor-pointer"
      onClick={() => navigate(`/levels/${subject.id}`)}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <Icon className="w-6 h-6 text-blue-500" />
        </div>

        <div className="flex-1">
          <h3 className="font-medium text-gray-900">
            {subject.subjectName}
          </h3>
          <p className="text-sm text-gray-500">
            {completedLevels.length} of {totalLevels.length} levels completed
          </p>
        </div>

        <div className="relative">
          <ProgressCircle 
            progress={progress}
            className={`relative ${
              progress >= 66 ? 'stroke-green-500' :
              progress >= 33 ? 'stroke-blue-500' :
              'stroke-orange-500'
            }`}
          />
        </div>
      </div>
    </Card>
  )
}

