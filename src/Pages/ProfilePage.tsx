import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppContext } from "@/Context/AppContext";
import { AppContextType, UserType } from "@/types";
import { EyeIcon, EyeOffIcon, Loader, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import femaleAvatar from "../assets/FemaleAvatar.jpeg";
import maleAvatar from "../assets/MaleAvatar.jpeg";
import { BsThreeDots } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API_URL } from "@/App";
import { useToast } from "@/hooks/use-toast";
import coin3DIcon from "../assets/3DCoinsIcon.png";
import UsersCompletedLevels from "@/components/UsersCompletedLevels";
import UsersSubjectProgression from "@/components/UsersSubjectProgression";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUsersTotalPoints } from "@/hooks/useUsersTotalPoints";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ProfilePage = () => {
  const { toast } = useToast();
  const { loggedInUser, setLoggedInUser } = useContext(
    AppContext
  ) as AppContextType;
  const { totalPoints, isLoading: isUsersTotalPointsLoading } =
    useUsersTotalPoints();
  const [newName, setNewName] = useState<string>(loggedInUser?.name || "");
  const [newPassword, setNewPassword] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [isEditNameDialogOpen, setIsEditNameDialogOpen] =
    useState<boolean>(false);
  const [isEditNameSheetOpen, setIsEditNameSheetOpen] =
    useState<boolean>(false);
  const [isEditPasswordDialogOpen, setIsEditPasswordDialogOpen] =
    useState<boolean>(false);
  const [isEditPasswordSheetOpen, setIsEditPasswordSheetOpen] =
    useState<boolean>(false);
  const [isShowCurrentPassword, setIsShowCurrentPassword] =
    useState<boolean>(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState<boolean>(false);
  const [isUpdatingName, setIsUpdatingName] = useState<boolean>(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);

  useEffect(() => {
    if (loggedInUser === null) return;
    setNewName(loggedInUser.name);

    console.log("loggedInUser", loggedInUser);
  }, [loggedInUser]);

  const handleUpdateName = async () => {
    try {
      if (newName.trim() === "") toast({ title: "A new name is required" });
      setIsUpdatingName(true);
      const response = await axios.put<{ success: boolean; newUser: UserType }>(
        `${API_URL}/user/name`,
        {
          newName: newName,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setLoggedInUser(response.data.newUser);
      isEditNameDialogOpen && setIsEditNameDialogOpen(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to update user's name",
        description: "Please check your network connection",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (
        newPassword.trim().length === 0 ||
        currentPassword.trim().length === 0
      ) {
        toast({ title: "password cannot be empty" });
        return;
      }
      setIsUpdatingPassword(true);
      const response = await axios.put<{ success: boolean; message: string }>(
        `${API_URL}/user/password`,
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      isEditPasswordDialogOpen && setIsEditPasswordDialogOpen(false);
      toast({
        title: "Password updated successfully",
        variant: "default",
      });
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Failed to update user's password",
        description: error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${API_URL}/auth/logout`, {
        withCredentials: true,
      });
      setLoggedInUser(null);
    } catch (error) {
      toast({
        title: "Failed to logout",
        description: "check your network connection",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center bg-[#ecfbff] h-screen">
        {/* header */}
        <div className="flex items-center gap-2 justify-center w-full bg-blue-500 text-white p-4">
          <User />
          <h1 className="font-semibold text-xl">Profile</h1>
        </div>
        <div className="flex flex-col items-center bg-[#ecfbff] px-4 w-full gap-8">
          <div className="flex items-center justify-end w-full mt-8">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Logout</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to logout?
                  </AlertDialogTitle>
                  <AlertDialogDescription></AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="my-1">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="flex flex-col border-2 shadow-md p-4 w-full bg-white rounded-lg">
            <div className="flex items-center justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <BsThreeDots />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Profile changes</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="md:hidden"
                    onClick={() => setIsEditNameSheetOpen(true)}
                  >
                    Edit name
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hidden md:flex"
                    onClick={() => setIsEditNameDialogOpen(true)}
                  >
                    Edit name
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsEditPasswordSheetOpen(true)}
                    className="md:hidden"
                  >
                    Edit password
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hidden md:flex"
                    onClick={() => setIsEditPasswordDialogOpen(true)}
                  >
                    Edit password
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="text-md text-gray-600 font-medium px-2 mb-2">
              {loggedInUser?.role}
            </div>
            <div className="px-2 my-2 flex items-center gap-2">
              {loggedInUser?.avatar === "MALE" ? (
                <>
                  <Avatar>
                    <AvatarImage src={maleAvatar} />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                </>
              ) : (
                <>
                  <Avatar>
                    <AvatarImage src={femaleAvatar} />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                </>
              )}
              <div className="flex flex-col">
                <span className="text-gray-500 font-semibold text-xl">
                  {loggedInUser?.name}
                </span>
                <span className="text-gray-400 font-normal text-lg">
                  {loggedInUser?.email}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-md text-gray-600 font-medium px-2">
                Total score
              </span>
              <div className="flex items-center gap-2">
                <img className="w-6 h-6" src={coin3DIcon} alt="" />
                {isUsersTotalPointsLoading ? (
                  <>
                    <Loader />
                  </>
                ) : (
                  <>
                    <span className="font-semibold">{totalPoints}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col p-4 w-full bg-white border-2 rounded-lg shadow-md">
            <div className="text-gray-600 font-medium text-lg mb-4">
              Subjects Progression
            </div>
            <UsersSubjectProgression />
          </div>
          <div className="flex flex-col p-4 w-full bg-white border-2 rounded-lg shadow-md mb-40">
            <div className="text-gray-600 font-medium text-lg">
              Completed Levels
            </div>
            <UsersCompletedLevels />
          </div>
        </div>
        <Sheet open={isEditNameSheetOpen} onOpenChange={setIsEditNameSheetOpen}>
          <SheetContent side={"bottom"}>
            <SheetHeader className="mb-4">
              <SheetTitle>Edit Name</SheetTitle>
              <SheetDescription>Edit your profile name</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="newName">Edit Name</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  type="text"
                  name="newName"
                  id="newName"
                />
              </div>
            </div>
            <SheetFooter className="gap-1 mt-4">
              <Button
                disabled={isUpdatingName}
                variant={"destructive"}
                onClick={() => setIsEditNameSheetOpen(false)}
              >
                Cancel
              </Button>
              <Button disabled={isUpdatingName} onClick={handleUpdateName}>
                Save Changes
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <Dialog
          open={isEditNameDialogOpen}
          onOpenChange={setIsEditNameDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Name</DialogTitle>
              <DialogDescription>Edit your profile name</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="newName">Edit Name</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  type="text"
                  name="newName"
                  id="newName"
                />
              </div>
            </div>
            <DialogFooter className="gap-1">
              <Button
                disabled={isUpdatingName}
                variant={"destructive"}
                onClick={() => setIsEditNameDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button disabled={isUpdatingName} onClick={handleUpdateName}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Sheet
          open={isEditPasswordSheetOpen}
          onOpenChange={setIsEditPasswordSheetOpen}
        >
          <SheetContent side={"bottom"}>
            <SheetHeader className="mb-8">
              <SheetTitle>Edit Password</SheetTitle>
              <SheetDescription>
                Edit user's current password with new password
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 ">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                </div>
                <div className="relative">
                  <Input
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    type={isShowCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    id="currentPassword"
                  />
                  <button
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() =>
                      setIsShowCurrentPassword(!isShowCurrentPassword)
                    }
                  >
                    {isShowCurrentPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                </div>
                <div className="relative">
                  <Input
                    type={isShowNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    name="newPassword"
                    id="newPassword"
                  />
                  <button
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setIsShowNewPassword(!isShowNewPassword)}
                  >
                    {isShowNewPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
              </div>
            </div>
            <SheetFooter className="gap-1 mt-4">
              <Button
                disabled={isUpdatingPassword}
                variant={"destructive"}
                onClick={() => setIsEditPasswordSheetOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword}
              >
                Save changes
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <Dialog
          open={isEditPasswordDialogOpen}
          onOpenChange={setIsEditPasswordDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Password</DialogTitle>
              <DialogDescription>
                Edit user's current password with new password
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 ">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                </div>
                <div className="relative">
                  <Input
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    type={isShowCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    id="currentPassword"
                  />
                  <button
                    className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
                    onClick={() =>
                      setIsShowCurrentPassword(!isShowCurrentPassword)
                    }
                  >
                    {isShowCurrentPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                </div>
                <div className="relative">
                  <Input
                    type={isShowNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    name="newPassword"
                    id="newPassword"
                  />
                  <button
                    className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
                    onClick={() => setIsShowNewPassword(!isShowNewPassword)}
                  >
                    {isShowNewPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-1">
              <Button
                disabled={isUpdatingPassword}
                variant={"destructive"}
                onClick={() => setIsEditPasswordDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword}
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ProfilePage;
