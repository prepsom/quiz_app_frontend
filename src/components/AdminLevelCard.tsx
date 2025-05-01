

import { AppContextType, LevelType } from '@/types'
import { Button } from './ui/button'
import { useContext, useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import axios from 'axios';
import { API_URL } from '@/App';
import { useToast } from '@/hooks/use-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { AppContext } from '@/Context/AppContext';


type Props = {
    level:LevelType
    setLevels:React.Dispatch<React.SetStateAction<LevelType[]>>;
}

const AdminLevelCard = ({level,setLevels}:Props) => {
    const navigate = useNavigate();
    const {toast} = useToast();
    const [isDeleteLevelAlertOpen,setIsDeleteLevelAlertOpen] = useState<boolean>(false);
    const [deleteLevelConfirmation,setDeleteLevelConfirmation] = useState<string>("");
    const isDeleteLevelConfirmationCorrect = deleteLevelConfirmation === `DELETE ${level.levelName}`;
    const [isDeletingLevel,setIsDeletingLevel] = useState<boolean>(false);
    const [isEditLevelModalOpen,setIsEditLevelModalOpen] = useState<boolean>(false);
    const [newLevelName,setNewLevelName] = useState<string>(level.levelName);
    const [isEditingLevel,setIsEditingLevel] = useState<boolean>(false);
    const [newPassingQuestions,setNewPassingQuestions] = useState<number>(level.passingQuestions);
    const {loggedInUser} = useContext(AppContext) as AppContextType;
    const role = loggedInUser?.role==="ADMIN" ? "admin" : loggedInUser?.role==="TEACHER" ? "teacher" : "student";
    if(role==="student") return <Navigate to="/"/>

    const handleDeleteLevel = async () => {
        try {
            setIsDeletingLevel(true);
            await axios.delete(`${API_URL}/level/${level.id}` ,{
                withCredentials:true,
            });
            setLevels(prevLevels => prevLevels.filter((lev) => lev.id !== level.id));
            toast({
                title:"Level deleted successfully",
                description:"Level and questions in this level have been deleted",
                variant:"default",
            });
        } catch (error) {
            toast({
                title:"Failed to delete level",
                description:"check your network connection",
                variant:"destructive",
            });
        } finally {
            setIsDeletingLevel(false);
        }
    }

    const handleEditLevel = async () => {
        if(newLevelName.trim()==="" || newPassingQuestions <= 0) return;
        try {
            setIsEditingLevel(true);
            const response = await axios.put<{success:boolean;message:string;level:LevelType}>(`${API_URL}/level/${level.id}`,{
                newLevelName:newLevelName.trim(),
                passingQuestions:newPassingQuestions,
            },{
                withCredentials:true,
            });
            const updatedLevel = response.data.level;

            setLevels((prevLevels) => {

                const updatedLevels = prevLevels.map((lev) => {

                    if(lev.id === level.id) {
                        return updatedLevel;
                    } else {
                        return lev;
                    }
                });

                return updatedLevels;
            });

            toast({
                title:"Level updated successfully",
                description:"Level name has been updated",
                variant:"default",
            });
            setNewLevelName("");
            setIsEditLevelModalOpen(false);
        } catch (error) {
            toast({
                title:"Failed to update level",
                description:"check your network connection",
                variant:"destructive",
            });
        } finally {
            setIsEditingLevel(false);
        }
    }

    const toggleEditLevelModal = () => {
        if(isEditLevelModalOpen) {
            setIsEditLevelModalOpen(false);
        } else {
            setIsEditLevelModalOpen(true);
            setNewLevelName(level.levelName);
            setNewPassingQuestions(level.passingQuestions);
        }
    }

    return (
    <>
        <div className='flex flex-col justify-between gap-4 bg-white shadow-md p-4 w-full rounded-lg'>
            <div className='flex items-start justify-between'>
                <div className='flex flex-col gap-1'>
                    <h1 className='text-gray-600 font-semibold text-xl'>Level {level.position}</h1>
                    <p className='text-gray-600 text-md'>{level.levelName}</p>
                    <div className='flex items-center gap-2'>
                        <span className='text-gray-600'>Passing Questions</span>
                        <span className='font-semibold text-gray-600'>{level.passingQuestions}</span>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <Button onClick={() => navigate(`/${role}/questions/${level.id}`)} variant="outline">View Questions</Button>
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <Button onClick={toggleEditLevelModal} className='border-2 border-blue-500 text-blue-500 bg-white hover:bg-blue-500 hover:text-white hover:duration-300'>Edit</Button>
                <Button onClick={() => setIsDeleteLevelAlertOpen(true)} className= 'bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:duration-300'>Delete</Button>
            </div>
            <Dialog open={isDeleteLevelAlertOpen} onOpenChange={setIsDeleteLevelAlertOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Level</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this level? Questions in this level will 
                            also be deleted. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='deleteLevelConfirmation'>Enter : "DELETE {level.levelName}"</Label>
                        <Input type='text' id='deleteLevelConfirmation' value={deleteLevelConfirmation} onChange={(e) => setDeleteLevelConfirmation(e.target.value)}/>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button disabled={isDeletingLevel} variant={"outline"}>Cancel</Button>
                        </DialogClose>
                        <Button disabled={(isDeleteLevelConfirmationCorrect===false || isDeletingLevel)} onClick={handleDeleteLevel}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={isEditLevelModalOpen} onOpenChange={toggleEditLevelModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Level</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col gap-4 w-full'>
                        <div className='flex flex-col gap-2 w-full'>
                            <Label htmlFor='newLevelName'>Level Name</Label>
                            <Input type='text' id='newLevelName' value={newLevelName} onChange={(e) => setNewLevelName(e.target.value)}/>
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                            <Label htmlFor='newPassingQuestions'>Passing Questions</Label>
                            <Input type='number' id='newPassingQuestions' value={newPassingQuestions} onChange={(e) => setNewPassingQuestions(Number(e.target.value))}/>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button disabled={isEditingLevel} variant={"outline"}>Cancel</Button>
                        </DialogClose>
                        <Button disabled={(newLevelName.trim()==="" || newPassingQuestions <= 0) || isEditingLevel} onClick={handleEditLevel}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </>
  )
}


export default AdminLevelCard;
