import { LevelType } from "@/types"
import {  Star, CheckCircle } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import levelLocked3DIcon from "../assets/LevelLockedIcon.png"


interface LevelCardProps {
  level: LevelType
  isLocked: boolean
  isCompleted: boolean
  currentLevel: number
  index:number;
}

export function LevelCard({ level,isLocked,isCompleted,index}: LevelCardProps) {
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
            <>
              <img src={levelLocked3DIcon} alt="" />
            </>
          ) : (
            <Star className="w-6 h-6 text-white" />
          )}
        </div>

        <div className="flex-1">
          <div className="text-sm text-blue-500 font-light uppercase">
            LEVEL {index + 1}
          </div>
          <h3 className={`text-lg text-[#374151] font-bold ${isLocked ? 'text-[#9ca3af]':''} `}>
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

