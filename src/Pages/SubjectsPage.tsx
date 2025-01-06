import { AppContext } from '@/Context/AppContext'
import { useSubjectsByGrade } from '@/hooks/useSubjectsByGrade'
import { AppContextType } from '@/types'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader2} from 'lucide-react'
import { SubjectCard } from '@/components/SubjectCard'
import SubjectsCarousel from '@/components/SubjectsCarousel'

export default function SubjectsPage() {
  const { loggedInUser} = useContext(AppContext) as AppContextType;
  if (loggedInUser === null) return <Navigate to="/login" />  
  const { subjects, isLoading } = useSubjectsByGrade(loggedInUser?.gradeId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">      
      {/* Header */}
      {/* <div className="bg-blue-500 p-6 flex items-center justify-between text-white">
        <h1 className="text-2xl font-bold">Your Subjects</h1>
      </div> */}

      {/* Score Display */}

      <div className='p-4 flex flex-col justify-center'>
        <div className='text-gray-500'>Hello {loggedInUser.name}!</div>
        <div className='text-2xl text-gray-600 font-semibold'>What would you like to learn today</div>
      </div>

      <SubjectsCarousel subjects={subjects}/>

      {/* Subjects List */}

      <div className='p-4 flex items-center my-2 text-2xl font-semibold text-gray-700'>Unfinished games</div>
      <div className="max-w-lg mx-auto p-4 space-y-4">
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  )
}

