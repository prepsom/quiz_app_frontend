import { AppContext } from "@/Context/AppContext";
import { useSubjectsByGrade } from "@/hooks/useSubjectsByGrade";
import { AppContextType } from "@/types";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SubjectCard } from "@/components/SubjectCard";
import SubjectsCarousel from "@/components/SubjectsCarousel";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API_URL } from "@/App";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function SubjectsPage() {
  const { loggedInUser, setLoggedInUser } = useContext(
    AppContext
  ) as AppContextType;
  if (loggedInUser === null) return <Navigate to="/login" />;
  const { subjects, isLoading } = useSubjectsByGrade(loggedInUser?.gradeId);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white border h-screen">
      <div className="p-4 flex flex-col justify-center gap-2">
        <div className="flex items-center justify-between">
          <div className="text-gray-500 mt-4">Hello {loggedInUser.name}!</div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Logout</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>Are you sure you want to logout?</AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="my-1">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-2xl text-gray-600 font-semibold">
          What would you like to learn today
        </div>
      </div>

      <SubjectsCarousel subjects={subjects} />

      <div className="p-4 flex items-center my-2 text-2xl font-semibold text-gray-700">
        Unfinished games
      </div>
      <div className="max-w-lg mx-auto p-4 space-y-4">
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
}
