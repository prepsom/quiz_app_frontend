import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppContext } from "@/Context/AppContext";
import { AppContextType, UserType } from "@/types";
import {EyeIcon, EyeOffIcon, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import femaleAvatar from "../assets/FemaleAvatar.jpeg"
import maleAvatar from "../assets/MaleAvatar.jpeg"
import { BsThreeDots } from "react-icons/bs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog,DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API_URL } from "@/App";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/use-toast";


const ProfilePage = () => {
  const {toast} = useToast();
  const {loggedInUser,setLoggedInUser} = useContext(AppContext) as AppContextType;
  const [newName,setNewName] = useState<string>(loggedInUser?.name || "");
  const [newPassword,setNewPassword] = useState<string>("");
  const [currentPassword,setCurrentPassword] = useState<string>("");
  const [isEditNameDialogOpen,setIsEditNameDialogOpen] = useState<boolean>(false);
  const [isEditPasswordDialogOpen,setIsEditPasswordDialogOpen] = useState<boolean>(false);
  const [isPasswordCorrect,setIsPasswordCorrect] = useState<boolean>(true);
  const [isShowCurrentPassword,setIsShowCurrentPassword] = useState<boolean>(false);
  const [isShowNewPassword,setIsShowNewPassword] = useState<boolean>(false);
  const debouncedPassword = useDebounce(currentPassword,500);
  const [isUpdatingName,setIsUpdatingName] = useState<boolean>(false);
  const [isUpdatingPassword,setIsUpdatingPassword] = useState<boolean>(false);



  useEffect(() => {
    if(loggedInUser===null) return;
    setNewName(loggedInUser.name);
  },[loggedInUser]);
  
  useEffect(() => {

    const checkPassword = async () => {
      try {
        const response = await axios.post<{success:boolean;isPasswordCorrect:boolean}>(`${API_URL}/user/check-password`,{"password":currentPassword},{withCredentials:true});
        console.log(response);
        setIsPasswordCorrect(response.data.isPasswordCorrect);
      } catch (error) {
        console.log(error);
      }
    }

    checkPassword();

  },[debouncedPassword])



  const handleUpdateName = async () => {
    try {
      if(newName.trim()==="") toast({title:"A new name is required"})
      setIsUpdatingName(true);
      const response = await axios.put<{success:boolean;newUser:UserType}>(`${API_URL}/user/name`,{
        "newName":newName,
      },{
        withCredentials:true,
      });
      console.log(response);
      setLoggedInUser(response.data.newUser);
      isEditNameDialogOpen && setIsEditNameDialogOpen(false);
    } catch (error) {
      console.log(error);
      toast({
        title:"Failed to update user's name",
        description:"Please check your network connection",
        variant:"destructive"
      });
    } finally {
      setIsUpdatingName(false);
    }
  }

  const handleUpdatePassword = async () => {
    try {
      if(newPassword.trim().length===0) toast({title:"password cannot be empty"});
      setIsUpdatingPassword(true);
      const response = await axios.put<{success:boolean;message:string}>(`${API_URL}/user/password`,{
        "newPassword":newPassword,
      },{
        withCredentials:true,
      });
      console.log(response);
      isEditPasswordDialogOpen && setIsEditPasswordDialogOpen(false);
      toast({
        title:"Password updated successfully",
        variant:"default"
      });
      setIsPasswordCorrect(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error:any) {
      console.log(error);
      toast({
        title:"Failed to update user's password",
        description:error.response.data.message,
        variant:"destructive"
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  }

  return (
    <>
    <div className="flex flex-col items-center bg-[#ecfbff] h-screen">
      {/* header */}
      <div className="flex items-center gap-2 justify-center w-full bg-blue-500 text-white p-4">
        <User/>
        <h1 className="font-semibold text-xl">Profile</h1>
      </div>
      <div className="flex flex-col items-center bg-[#ecfbff] px-4 w-full">
        <div className="flex flex-col border-2 shadow-md p-4 w-full mt-14 bg-white rounded-lg">
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <BsThreeDots/>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Profile changes</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => setIsEditNameDialogOpen(true)}>Edit name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsEditPasswordDialogOpen(true)}>Edit password</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="text-md text-gray-600 font-medium px-2 mb-2">{loggedInUser?.role}</div>
          <div className="px-2 my-2 flex items-center gap-2">
            {loggedInUser?.avatar==="MALE" ? (
              <>
                <Avatar>
                  <AvatarImage src={maleAvatar}/>
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              </>
            ) : (
              <>
                <Avatar>
                  <AvatarImage src={femaleAvatar}/>
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              </>
            )}
            <div className="flex flex-col">
              <span className="text-gray-500 font-semibold text-xl">{loggedInUser?.name}</span>
              <span className="text-gray-400 font-normal text-lg">{loggedInUser?.email}</span>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isEditNameDialogOpen} onOpenChange={setIsEditNameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Name</DialogTitle>
            <DialogDescription>Edit your profile name</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="newName">Edit Name</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} type="text" name="newName" id="newName"/>
            </div>
          </div>
          <DialogFooter className="gap-1">
            <Button disabled={isUpdatingName} variant={"destructive"} onClick={() => setIsEditNameDialogOpen(false)}>Cancel</Button>
            <Button disabled={isUpdatingName} onClick={handleUpdateName}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditPasswordDialogOpen} onOpenChange={setIsEditPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Password</DialogTitle>
            <DialogDescription>Edit user's current password with new password</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 ">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <button onClick={() => setIsShowCurrentPassword(!isShowCurrentPassword)}>{isShowCurrentPassword ? <EyeIcon/> : <EyeOffIcon/>}</button>
              </div>
              <Input value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type={isShowCurrentPassword ? "text" : "password"} name="currentPassword" id="currentPassword"/>
            </div>
            {isPasswordCorrect && <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <button onClick={() => setIsShowNewPassword(!isShowNewPassword)}>{isShowNewPassword ? <EyeIcon/> : <EyeOffIcon/>}</button>
              </div>
              <Input type={isShowNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} name="newPassword" id="newPassword"/>
            </div>}
          </div>
          <DialogFooter className="gap-1">
            <Button disabled={isUpdatingPassword} variant={"destructive"} onClick={() => setIsEditPasswordDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
};

export default ProfilePage;
