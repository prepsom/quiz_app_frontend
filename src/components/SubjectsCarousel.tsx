import { SubjectType } from '@/types'
import { BeakerIcon, Book, ComputerIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  subjects: SubjectType[]
}

const subjectIcons = {
  "Science": <BeakerIcon className="w-6 h-6" />,
  "Mathematics": <Book className="w-6 h-6" />,
  "Computer": <ComputerIcon className="w-6 h-6" />
}

const SubjectsCarousel = ({ subjects }: Props) => {
    const navigate = useNavigate();
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {subjects.map((subject: SubjectType) => {
          const icon = subjectIcons[subject.subjectName as keyof typeof subjectIcons] || <Book className="w-6 h-6" />
          return (
            <div
              onClick={() => navigate(`/levels/${subject.id}`)}      
              key={subject.id}
              className="flex flex-col items-center p-6 min-w-[160px] bg-gradient-to-b from-blue-50 to-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="mb-3 p-3 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform duration-200">
                <div className="text-blue-600">
                  {icon}
                </div>
              </div>
              <div className="text-lg font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                {subject.subjectName}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SubjectsCarousel;


