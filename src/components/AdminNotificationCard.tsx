

import { Notification } from '@/types'
import React, { useState } from 'react'
import {formatDate} from "date-fns"
import { EditIcon, TrashIcon } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '@/App';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';


type Props = {
    notification:Notification;
    setNotifications:React.Dispatch<React.SetStateAction<Notification[]>>;
}

const AdminNotificationCard = ({notification,setNotifications}:Props) => {
    const {toast} = useToast();
    const [isEditNotification,setIsEditNotification] = useState<boolean>(false);
    const [newNotificationMessage,setNewNotificationMessage] = useState<string>("");
    const [isEditingNotification,setIsEditingNotification] = useState<boolean>(false);


    const handleNotificationEdit = async () => {
        try {
            setIsEditingNotification(true);
            const response = await axios.put<{success:boolean;notification:Notification}>(`${API_URL}/notification/${notification.id}`,{
                message:newNotificationMessage.trim(),
            },{
                withCredentials:true,
            });

            setNotifications((prevNotifications) => {
                const newNotifications = prevNotifications.map((noti) => {

                    if(noti.id===notification.id) {
                        return response.data.notification;
                    } else {
                        return noti;
                    }
                });

                return newNotifications;
            });

            setNewNotificationMessage("");
            setIsEditNotification(false);
        } catch (error) {
            toast({
                title:"Failed to edit notification",
                description:"Please check your network connection",
                variant:"destructive"
            });
        } finally {
            setIsEditingNotification(false);
        }
    }

    const handleNotificationDelete = async () => {
        // remove this current component from notifications
        try {
            await axios.delete<{success:boolean;message:string}>(`${API_URL}/notification/${notification.id}`,{
                withCredentials:true,
            });
            setNotifications((prevNotifications) => prevNotifications.filter((noti) => noti.id!==notification.id));            
        } catch (error) {
            console.log(error);
            toast({
                title:"Failed to remove notification",
                description:"Please check your network connection",
                variant:"destructive"
            })  
        }
    }


  return (
    <>
        <div className='flex flex-col bg-white w-full p-4 border-2 rounded-lg shadow-md'>
            <div className='flex flex-wrap text-sm font-semibold text-gray-800'>
                {notification.message}
            </div>
            <div className='font-semibold text-gray-500'>
                {formatDate(notification.createdAt,"d/M/yyyy")}
            </div>
            <div className='flex items-center gap-2 my-2'>
                <button onClick={handleNotificationDelete} className='text-red-400'><TrashIcon/></button>
                <button onClick={() => {
                    setIsEditNotification(true);
                    setNewNotificationMessage(notification.message);
                }} className='text-blue-500'><EditIcon/></button>
            </div>
            <Dialog open={isEditNotification} onOpenChange={setIsEditNotification}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit notification</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col w-full'>
                        <Label htmlFor='newNotificationMessage'>Message</Label>
                        <Input value={newNotificationMessage} onChange={(e) => setNewNotificationMessage(e.target.value)} type='text' name='newNotificationMessage'/>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={"outline"}>Cancel</Button>
                        </DialogClose>
                        <Button disabled={newNotificationMessage.trim()==="" || isEditingNotification} onClick={handleNotificationEdit}>Edit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </>
  );
}

export default AdminNotificationCard