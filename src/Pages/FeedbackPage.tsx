import { Button } from '@/components/ui/button';
import { AppContext } from '@/Context/AppContext';
import { AppContextType, LevelCompletionResponse, LevelType } from '@/types'
import  { useContext } from 'react'
import { RxAvatar } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';

type Props = {
    levelCompletionData:LevelCompletionResponse;
    level:LevelType;
}
const FeedbackPage = ({levelCompletionData, level}: Props) => {
    const navigate = useNavigate();
    const {loggedInUser} = useContext(AppContext) as AppContextType;

    return (
    <div className='min-h-screen flex flex-col items-center'>
        <div className='p-6 bg-blue-500 text-white w-full flex justify-center'>
            <div className='text-2xl font-bold'>Performance Report</div>
        </div>

        <div className='flex flex-col w-full px-4 max-w-3xl'>
            <div className='flex items-center gap-4 my-4'>
                <div className='text-6xl text-blue-500'><RxAvatar/></div>
                <div className='text-blue-500 font-semibold text-xl'>{loggedInUser?.name}</div>
            </div>
            <div className='flex items-center gap-2'>
                <span className='tracking-wide text-blue-600'>LEVEL :</span>
                <span className='text-[#374151] font-semibold'>{level.levelName}</span>
            </div>
            
            <div className='flex flex-col gap-4 my-4 pb-20'>
                <div className='border rounded-lg bg-[#ecfbff] p-4 flex flex-col w-full gap-2'>
                    <div className='flex items-center justify-start text-blue-500 font-semibold text-xl'>Overall Performance</div>
                    <div className='flex items-center flex-wrap gap-4'>
                        <div className='flex items-center gap-2'>
                            <span className='text-[#6B7280]'>Score Achieved</span>
                            <span className='text-[#4B5563]'>{levelCompletionData.percentage}%</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='text-[#6B7280]'>Level Passed</span>
                            <span className='text-[#4B5563]'>{levelCompletionData.isComplete ? "Yes" : "No"}</span>
                        </div>
                    </div>
                    <div className='text-[#6B72803]'>Remarks:</div>
                    <div className='flex flex-wrap text-[#4B5563]'>
                        Great job, {loggedInUser?.name}! You've shown strong understanding of basic concepts. A little more focus on applying concepts creatively, and you'll ace the next level!
                    </div>
                </div>

                <div className='border rounded-lg bg-[#f1ffec] p-4 flex flex-col w-full gap-2'>
                    <div className='flex items-center justify-start text-[#10BC58] font-semibold text-xl'>Strengths</div>
                    <ul className='flex flex-col items-start gap-2 list-disc px-4'>
                        {levelCompletionData.strengths?.map((strength:string,index:number) => (
                            <li className='text-[#4B5563]' key={index}>{strength}</li>
                        ))}
                    </ul>
                </div>

                <div className='border rounded-lg bg-[#feeeee] p-4 flex flex-col w-full gap-2'>
                    <div className='flex items-center justify-start text-[#F77367] font-semibold text-xl'>Weaknesses</div>
                    <ul className='flex flex-col items-start gap-2 list-disc px-4'>
                        {levelCompletionData.weaknesses?.map((weakness:string,index:number) => (
                            <li className='text-[#4B5563]' key={index}>{weakness}</li>
                        ))}
                    </ul>
                </div>

                <div className='border rounded-lg bg-[#ecfbff] p-4 flex flex-col w-full gap-2'>
                    <div className='flex items-center justify-start text-[#3779F6] font-semibold text-xl'>Recommendations</div>
                    <ul className='flex flex-col items-start gap-2 list-disc px-4'>
                        {levelCompletionData.recommendations?.map((recommendation:string,index:number) => (
                            <li className='text-[#4B5563]' key={index}>{recommendation}</li>
                        ))}
                    </ul>
                </div>
                <div className='flex items-center justify-end'>
                    <Button variant="outline" onClick={() => navigate(`/levels/${level.subjectId}`)}>Back to levels</Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FeedbackPage