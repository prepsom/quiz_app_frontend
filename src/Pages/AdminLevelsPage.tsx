import { API_URL } from '@/App';
import AdminLevelCard from '@/components/AdminLevelCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useGetSubjectById } from '@/hooks/useGetSubjectById';
import { useLevelsBySubject } from '@/hooks/useLevelsBySubject';
import { LevelType } from '@/types';
import axios from 'axios';
import { ArrowLeft, Loader } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom'

type AddLevelRequestBody = {
    levelName: string;
    subjectId: string;
    passingQuestions: number;
};

const AdminLevelsPage = () => {
    
    const {toast} = useToast();
    const {subjectId} = useParams<{subjectId:string}>();
    const {isLoading:isLevelsLoading,levels,setLevels} = useLevelsBySubject(subjectId!);
    const {isLoading:isSubjectLoading,subject} = useGetSubjectById(subjectId!);
    const [isAddLevelModalOpen,setIsAddLevelModalOpen] = useState<boolean>(false);
    const  [levelName,setLevelName] = useState<string>("");
    const [passingQuestions,setPassingQuestions] = useState<number>(0);
    const [isAddingLevel,setIsAddingLevel] = useState<boolean>(false);

    const handleAddLevel = async () => {
        
        if(levelName.trim()==="" || passingQuestions <=0 || !subject?.id) return;

        const createLevelRequestBody:AddLevelRequestBody = {
            levelName:levelName.trim(),
            passingQuestions:passingQuestions,
            subjectId:subject.id
        };

        try {
            setIsAddingLevel(true);
            const response = await axios.post<{success:boolean;message:string;level:LevelType}>(`${API_URL}/level`,createLevelRequestBody,{withCredentials:true});
            console.log(response);
            setLevels((prevLevels) => [...prevLevels,response.data.level]);
            setLevelName("");
            setPassingQuestions(0);
            setIsAddLevelModalOpen(false);
            toast({
                title:"Level added successfully",
                description:"The level has been added successfully",
                variant:"default"
            });
        } catch (error) {
            console.log(error);
            toast({
                title:"Error adding level",
                description:"An error occurred while adding the level",
                variant:"destructive"
            });
        } finally { 
            setIsAddingLevel(false);
        }
    }

    if(isLevelsLoading || isSubjectLoading) {
        return (
            <>
                <div className='flex items-center justify-center mt-28'>
                    <Loader/>
                </div>
            </>
        )
    }

    if(!subject) {
        return (
            <>
                <div className='flex items-center justify-center mt-28'>
                    Subject not found
                </div>
            </>
        )
    }

  return (
    <>
        <div className='flex flex-col items-center w-full bg-[#ecfbff] min-h-screen'>
            <div className='flex items-center justify-start w-full px-8 mt-14 mb-2'>
                <Link to={`/admin/subjects/${subject.gradeId}`} className='text-blue-500 flex items-center gap-2 hover:text-blue-600 hover:duration-300'>
                    <ArrowLeft/>
                    Back to subjects
                </Link>
            </div>
            <div className='flex flex-col items-start w-full px-8 mb-4'>
                <h1 className='text-xl text-blue-500 font-semibold'>Levels in {subject.subjectName}</h1>
                <p className='text-gray-600 font-sembold'>
                    Create, update and delete levels for {subject.subjectName}
                </p>
            </div>
            <div className='flex items-center justify-start w-full px-8'>
                <Button onClick={() => setIsAddLevelModalOpen(true)} className='bg-blue-500 text-white hover:bg-blue-600 hover:duration-300'>Add Level</Button>
            </div>
            <div className='flex flex-col items-center w-full px-8 gap-4 py-4'>
                {levels.map((level:LevelType) => {
                    return <AdminLevelCard level={level} key={level.id} setLevels={setLevels}/>
                })}
            </div>
            <Dialog open={isAddLevelModalOpen} onOpenChange={setIsAddLevelModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Level</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    
                    <div className='flex flex-col items-center gap-4 w-full'>
                        <div className='flex flex-col gap-2 w-full'>
                            <Label htmlFor='levelName'>Level Name</Label>
                            <Input type='text' id='levelName' value={levelName} onChange={(e) => setLevelName(e.target.value)}/>
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                            <Label htmlFor='passingQuestions'>Passing Questions</Label>
                            <Input type='number' id='passingQuestions' value={passingQuestions} onChange={(e) => setPassingQuestions(Number(e.target.value))}/>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button disabled={isAddingLevel} variant={"outline"}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleAddLevel} disabled={levelName.trim()==="" || passingQuestions <=0 || isAddingLevel}>Add Level</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </>
  )
}

export default AdminLevelsPage