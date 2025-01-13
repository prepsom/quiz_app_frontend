
import { useCompletedLevels } from '@/hooks/useCompletedLevels'
import { Loader } from 'lucide-react';
import LevelWithMetaDataCard from './LevelWithMetaDataCard';

const UsersCompletedLevels = () => {

    const {completedLevelsWithMetaData,isLoading} = useCompletedLevels();

    if(isLoading) {
        return (
            <>
                <div className='flex items-center justify-center'>
                    <Loader/>
                </div>
            </>
        )
    }

    return (
    <>
        <div className='flex flex-col gap-4'>
            {completedLevelsWithMetaData.map((completedLevel,_) => {
                return <LevelWithMetaDataCard levelWithMetaData={completedLevel}/>
            })}
        </div>
    </>
  )
}

export default UsersCompletedLevels