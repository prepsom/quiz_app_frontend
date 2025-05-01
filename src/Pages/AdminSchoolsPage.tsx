import { API_URL } from "@/App";
import { AlertDialog, AlertDialogCancel, AlertDialogContent,AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter, AlertDialogDescription, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AppContext } from "@/Context/AppContext";
import { useGetSchools } from "@/hooks/useGetSchools";
import { AppContextType, School } from "@/types";
import axios from "axios";
import { Loader } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminSchoolsPage = () => {
  const navigate = useNavigate();
  const { schools, isLoading: isSchoolsLoading } = useGetSchools();
  const { loggedInUser ,setLoggedInUser} = useContext(AppContext) as AppContextType;
  const [isLoggingOut,setIsLoggingOut] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await axios.get(`${API_URL}/auth/logout`,{
        withCredentials:true,
      });
      console.log(response);
      setLoggedInUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally { 
      setIsLoggingOut(false);
    }
  }

  if (isSchoolsLoading) {
    return (
      <>
        <div className="mt-28 flex items-center justify-center">
          <Loader />
        </div>
      </>
    );
  }

  if (!isSchoolsLoading && !loggedInUser) {
    return (
      <>
        <div className="flex items-center mt-28 font-semibold gap-2">
          <span>Please Login to access this content</span>
          <Link to="/login">Click here</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center bg-[#ecfbff] min-h-screen">
        <div className="flex items-center justify-end w-full px-8 mt-14">
          <AlertDialog>
            <AlertDialogTrigger asChild>
            <Button variant="outline" className="bg-blue-500 text-white hover:text-white hover:bg-blue-600 hover:duration-300">Logout</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                <AlertDialogDescription></AlertDialogDescription>
              </AlertDialogHeader>
              

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
                <AlertDialogAction disabled={isLoggingOut} onClick={handleLogout}>Logout</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex flex-col gap-2 px-8">
          <h1 className="text-blue-500 text-2xl font-semibold ">
            Welcome Admin {loggedInUser?.name}
          </h1>
          <p className="text-gray-600 font-semibold">
            Please go through the onboarding process by selecting the school and
            the respective class you want to Admin in. Don't worry , schools and
            classes can be switched later aswell.
          </p>
        </div>
        <div className="flex items-center text-blue-600 justify-center w-full my-4 font-semibold text-xl px-8">
          Our Institutes
        </div>
        <div className="flex flex-col items-center gap-4 px-8 py-4 mb-4 w-full">
          {schools.map((school: School) => {
            return (
              <div
                onClick={() => navigate(`/admin/grades/${school.id}`)}
                key={school.id}
                className="rounded-lg p-4 flex items-center cursor-pointer font-semibold text-gray-700 text-lg justify-start bg-white shadow-md hover:shadow-md hover:duration-300 w-full"
              >
                {school.schoolName}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AdminSchoolsPage;
