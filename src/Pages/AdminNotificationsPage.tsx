import { API_URL } from "@/App";
import AdminNotificationCard from "@/components/AdminNotificationCard";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppContext } from "@/Context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { useGetGradeById } from "@/hooks/useGetGradeById";
import { useNotificationsByGrade } from "@/hooks/useNotificationsByGrade";
import { AppContextType, Notification } from "@/types";
import axios from "axios";
import { ArrowLeft,Loader, PlusCircle } from "lucide-react";
import { useContext, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

const NOTIFICATIONS_PER_PAGE = 10;

const AdminNotificationsPage = () => {
  const {toast} = useToast();
  const { gradeId } = useParams<{ gradeId: string }>();
  const [page, setPage] = useState<number>(1);
  const {
    notifications,
    isLoading: isNotificationsLoading,
    totalPages,
    setNotifications,
  } = useNotificationsByGrade(gradeId!, page, NOTIFICATIONS_PER_PAGE);
  const { grade, isLoading: isGradeLoading } = useGetGradeById(gradeId!);
  const [isAddNotification, setIsAddNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [isAddingNotification,setIsAddingNotification] = useState<boolean>(false);
  const {loggedInUser} = useContext(AppContext) as AppContextType;
  const role = loggedInUser?.role==="ADMIN" ? "admin" : loggedInUser?.role==="TEACHER" ? "teacher" : "student";
  if(role==="student") return <Navigate to="/"/>

  const handleAddNotification = async () => {
    try {
        setIsAddingNotification(true);
        const response = await axios.post<{success:boolean;notification:Notification}>(`${API_URL}/notification/${gradeId}`,{
            message:notificationMessage,
        },{
            withCredentials:true,
        });
        setNotifications((prevNotifications) => [response.data.notification,...prevNotifications]);
        setNotificationMessage("");
        setIsAddNotification(false);
    } catch (error) {
        toast({
            title:"Failed to add notification",
            description:"please check your network connection",
            variant:"destructive"
        });
    } finally {
        setIsAddingNotification(false);
    }
  }

  const backToGradesPath = () => {
    if(role==="admin") {
        return `/${role}/grades/${grade?.schoolId}`
    } else {
        return `/${role}/grades`
    }
  }

  if (isNotificationsLoading || isGradeLoading) {
    return (
      <>
        <div className="flex items-center justify-center mt-14">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center bg-[#ecfbff] min-h-screen">
        <div className="flex items-center justify-start  mt-14 mb-2 w-full px-8">
            <Link to={backToGradesPath()} className="text-blue-500 flex items-center gap-2">
                <ArrowLeft/>
                Back to grades
            </Link>
        </div>
        <div className="flex flex-col w-full px-8">
          <h1 className="text-xl font-semibold text-blue-500">
            Notifications in Grade {grade?.grade}
          </h1>
          <p className="text-sm text-gray-700 font-semibold">
            View, remove and edit and add custom notifications for users in a
            particular grade
          </p>
        </div>
        <div className="flex items-center justify-start w-full px-8 my-4">
          <Button
            onClick={() => setIsAddNotification(true)}
            className="bg-blue-500 text-white hover:bg-blue-600 hover:duration-300"
          >
            <PlusCircle />
            Add
          </Button>
        </div>
        <div className="flex flex-col gap-2 items-center w-full px-8 mt-4 mb-8">
          {notifications.map((notification) => {
            return (
              <AdminNotificationCard
                key={notification.id}
                notification={notification}
                setNotifications={setNotifications}
              />
            );
          })}
          {notifications.length === 0 && (
            <div className="flex items-center justify-center text-lg font-semibold">
              No Notifications
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center w-full px-8 my-4">
            <Pagination
              currentPage={page}
              noOfPages={totalPages}
              setCurrentPage={setPage}
            />
          </div>
        )}
        <Dialog open={isAddNotification} onOpenChange={setIsAddNotification}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add notification</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="flex flex-col w-full gap-2">
              <Label htmlFor="notificationMessage">Notification</Label>
              <Input
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                type="text"
                name="notificationMessage"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddNotification} disabled={notificationMessage.trim()==="" || isAddingNotification}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminNotificationsPage;
