import { LevelType } from "@/types"
import { Lock, Star, Play, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

interface LevelCardProps {
  level: LevelType
  isLocked: boolean
  isCompleted: boolean
  currentLevel: number
}

export function LevelCard({ level, isLocked, isCompleted, currentLevel }: LevelCardProps) {
  const navigate = useNavigate()

  return (
      <div onClick={() => navigate(`/level/${level.id}`)} className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isCompleted ? 'bg-green-100' : 
          isLocked ? 'bg-gray-100' : 
          'bg-blue-500'
        }`}>
          {isCompleted ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : isLocked ? (
            <Lock className="w-6 h-6 text-gray-400" />
          ) : (
            <Star className="w-6 h-6 text-white" />
          )}
        </div>

        <div className="flex-1">
          <div className="text-sm text-blue-500 font-light uppercase">
            LEVEL {level.position + 1}
          </div>
          <h3 className="text-lg text-[#374151] font-bold">
            {level.levelName}
          </h3>
          {level.levelDescription && (
            <p className="text-sm text-gray-500">
              {level.levelDescription}
            </p>
          )}
        </div>
      </div>
  )
}

