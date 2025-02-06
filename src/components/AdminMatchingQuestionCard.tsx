

import { QuestionType } from '@/types';


type Props = {
    question:QuestionType;
}

const AdminMatchingQuestionCard = ({}:Props) => {
  return (
    <>
      <div className='flex items-center justify-center bg-white w-full rounded-lg shadow-md p-4'>
        <h1 className='text-gray-600 font-semibold text-xl'>Match the following not available</h1>
      </div>
    </>
  )
}

export default AdminMatchingQuestionCard