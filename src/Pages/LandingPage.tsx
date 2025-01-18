import { Button } from "@/components/ui/button";
import { Navigate, useNavigate } from "react-router-dom";
import owlMascotImage from "../assets/owl_image.png";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/Context/AppContext";
import { AppContextType } from "@/types";
// import RkInstitute from "../assets/RK Institute (1).png";
import { useGetSchoolNameByGrade } from "@/hooks/useGetSchoolName";
import { Loader } from "lucide-react";

// const schoolIconMap = new Map<string, string>([
//   ["Radha Krishna Educational Institute", RkInstitute],
// ]);

const LandingPage = () => {
  const navigate = useNavigate();
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState<boolean>(true);
  const { loggedInUser } = useContext(AppContext) as AppContextType;
  const { isLoading: isSchoolNameLoading, schoolName } =
    useGetSchoolNameByGrade(loggedInUser?.gradeId);

  // const schoolIconImage = useMemo(() => {
  //   if (schoolName === "" || isSchoolNameLoading) return;
  //   return schoolName !== "" && !isSchoolNameLoading
  //     ? schoolIconMap.get(schoolName)
  //     : "";
  // }, [schoolName]);

  useEffect(() => {
    const firstTime =
      localStorage.getItem("firstTimeLogin") === "true" ? true : false;
    setIsFirstTimeLogin(firstTime);
  }, []);

  const handleNavigateToSubjects = () => {
    localStorage.setItem("firstTimeLogin", "false");
    navigate(`${loggedInUser ? "/subjects" : "/login"}`);
  };

  if (!isFirstTimeLogin) {
    return <Navigate to="/subjects" />;
  }

  return (
    <div className="min-h-screen bg-[#EEF6FF] flex flex-col items-center justify-center p-2">
      <div className="w-full max-w-md flex flex-col items-center justify-around">
        {/* School Logo/Text*/}
        {/* <div className="mb-4 flex w-full px-4 py-2">
          <img
            src={schoolIconImage !== undefined ? schoolIconImage : ""}
            className="w-full aspect-auto"
          />
        </div> */}
        {isSchoolNameLoading ? (
          <>
            <div className="flex items-center justify-center">
              <Loader />
            </div>
          </>
        ) : (
          <>
            <div className="bg-white px-8 py-3 rounded-xl shadow-sm">
              <span className="text-gray-600 text-lg">{schoolName}</span>
            </div>
          </>
        )}

        {/* Owl Mascot */}
        <div className="w-56 h-56 relative">
          <img
            src={owlMascotImage}
            alt="Owl mascot with graduation cap"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Welcome Text */}
        <h1 className="text-blue-500 text-2xl font-bold">
          Welcome to PrepSOM!
        </h1>

        {/* Description */}
        {/* <p className="text-gray-600 text-center max-w-sm">
          Master concepts with interactive lessons, quick quizzes, and step-by-step solutions
          —tailored for your success!
        </p> */}

        {/* Get Started Button */}
        <Button
          onClick={handleNavigateToSubjects}
          className=" w-full fixed bottom-8 max-w-xs bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg"
        >
          GET STARTED
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
