import { QuestionType } from '@/types'

type Props = {
    question:QuestionType;
}

const AdminFillInBlankQuestionCard = ({}:Props) => {
  return (
    <>
      <div className='flex items-center justify-center bg-white w-full rounded-lg shadow-md p-4'>
        <h1 className='text-gray-600 font-semibold text-xl'>Fill in the blank not available</h1>
      </div>
    </>
  )
}

export default AdminFillInBlankQuestionCard