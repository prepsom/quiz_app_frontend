import { API_URL } from "@/App";
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
import { Button } from "@/components/ui/button";
import { AppContext } from "@/Context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { useTeacherGrades } from "@/hooks/useTeacherGrades";
import { AppContextType } from "@/types";
import axios from "axios";
import { Loader } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const TeacherGradesPage = () => {
  const navigate = useNavigate();
  const { loggedInUser, setLoggedInUser } = useContext(
    AppContext
  ) as AppContextType;
  const { teacherGrades, isLoading: isTeacherGradesLoading } =
    useTeacherGrades();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await axios.get(`${API_URL}/auth/logout`, {
        withCredentials: true,
      });
      setLoggedInUser(null);
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while logging out",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-[#ecfbff]">
        <div className="mt-14 flex items-center justify-end w-full px-8">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-blue-500 text-white hover:text-white hover:bg-blue-600 hover:duration-300"
              >
                Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to logout?
                </AlertDialogTitle>
                <AlertDialogDescription></AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoggingOut}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                >
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex flex-col w-full px-8 gap-2">
          <h1 className="text-2xl font-semibold text-blue-500">
            Welcome {loggedInUser?.name}
          </h1>
          <p className="text-md font-semibold text-gray-600">
            Please go through the onboarding process by selecting the class
            class you want to Admin in. Don't worry classes can be switched
            later aswell.
          </p>
        </div>
        {!isTeacherGradesLoading ? (
          <div className="flex flex-col gap-2 items-center justify-center w-full px-8 my-4">
            {teacherGrades
              .filter((grade) => grade.noOfStudents !== 0)
              .map((teacherGrade) => {
                return (
                  <div
                    key={teacherGrade.gradeId}
                    className="bg-white flex flex-col justify-between p-4 w-full border-2 rounded-lg shadow-md"
                  >
                    <span className="text-gray-600 font-semibold">
                      Grade {teacherGrade.grade}
                    </span>
                    <span className="text-gray-600 font-semibold">
                      No of students : {teacherGrade.noOfStudents}
                    </span>
                    <div className="flex items-center gap-4 mt-4">
                      <Button
                        onClick={() =>
                          navigate(`/teacher/students/${teacherGrade.gradeId}`)
                        }
                        variant="outline"
                      >
                        View Students
                      </Button>
                      <Button
                        onClick={() =>
                          navigate(`/teacher/subjects/${teacherGrade.gradeId}`)
                        }
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:duration-300"
                      >
                        View Subjects
                      </Button>
                    </div>
                    <div className="my-2">
                      <Button
                        onClick={() =>
                          navigate(
                            `/teacher/notifications/${teacherGrade.gradeId}`
                          )
                        }
                        variant={"outline"}
                      >
                        View Notifications
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center mt-10">
              <Loader />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TeacherGradesPage;
