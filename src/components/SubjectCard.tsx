import { SubjectType } from "@/types"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { Book, FlaskRoundIcon as Flask, Monitor } from 'lucide-react'

const subjectIcons = {
  'Mathematics': Book,
  'Science': Flask,
  'Computer': Monitor,
} as const;

interface SubjectCardProps {
  subject: SubjectType
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const navigate = useNavigate()
  const Icon = subjectIcons[subject.subjectName as keyof typeof subjectIcons] || Book

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
            Click to view levels
          </p>
        </div>
      </div>
    </Card>
  )
}

