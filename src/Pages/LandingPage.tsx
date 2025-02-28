import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import owlMascotImage from "../assets/owl_image.png";
import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "@/Context/AppContext";
import { AppContextType } from "@/types";
import { useGetSchoolNameByGrade } from "@/hooks/useGetSchoolName";
import { Loader } from "lucide-react";
import RkInstitute from "../assets/RKInstituteLogo.png";
import RadiantInstitute from "../assets/RadiantInstituteLogo.png";
import { capitalizeEachWord } from "@/utils";
import { useNotificationsByGrade } from "@/hooks/useNotificationsByGrade";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Pagination from "@/components/Pagination";
import { formatDate } from "date-fns";

const schoolIconMap = new Map<string, string>([
  ["Radha Krishna Educational Institute", RkInstitute],
  ["Radiant group tuitions", RadiantInstitute],
  ["PrepSOM School", owlMascotImage],
]);

const NOTIFICATIONS_PER_PAGE = 10;

const LandingPage = () => {
  const navigate = useNavigate();
  const { loggedInUser } = useContext(AppContext) as AppContextType;
  const { isLoading: isSchoolNameLoading, schoolName } =
    useGetSchoolNameByGrade(loggedInUser?.gradeId);
  const [page, setPage] = useState<number>(1);
  const {
    notifications,
    isLoading: isNotificationsLoading,
    totalPages,
  } = useNotificationsByGrade(
    loggedInUser?.gradeId!,
    page,
    NOTIFICATIONS_PER_PAGE
  );
  const [isViewNotifications, setIsViewNotifications] =
    useState<boolean>(false);

  useEffect(() => {
    if (
      localStorage.getItem("firstTimeLogin") &&
      localStorage.getItem("firstTimeLogin") === "false"
    ) {
      navigate("/subjects");
    }
  }, []);

  const schoolIconImage = useMemo(() => {
    if (schoolName === "" || isSchoolNameLoading) return;
    return schoolName !== "" && !isSchoolNameLoading
      ? schoolIconMap.get(schoolName)
      : "";
  }, [schoolName]);

  const handleGetStarted = () => {
    if (
      localStorage.getItem("firstTimeLogin") &&
      localStorage.getItem("firstTimeLogin") === "true"
    ) {
      localStorage.setItem("firstTimeLogin", "false");
    }
    navigate(`${loggedInUser ? "/subjects" : "/login"}`);
  };

  return (
    <div className="min-h-screen bg-[#EEF6FF] flex flex-col items-center justify-center p-2">
      <div className="w-full max-w-md flex flex-col items-center justify-around">
        <div className="relative">
          <div className="mb-4 flex w-3/5 mx-auto px-4 py-2">
            {isSchoolNameLoading ? (
              <>
                <div className="flex items-center">
                  <Loader />
                </div>
              </>
            ) : (
              <>
                <img
                  src={
                    schoolIconImage !== undefined
                      ? schoolIconImage
                      : owlMascotImage
                  }
                  className="w-full aspect-auto"
                />
              </>
            )}
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-blue-500 text-2xl font-bold text-center">
          Welcome to{" "}
          {schoolName !== "" ? capitalizeEachWord(schoolName) : "PrepSOM"}
        </h1>
        {!isNotificationsLoading && notifications.length !== 0 && (
          <div className="flex items-center gap-2 my-2">
            <span className="text-blue-400 font-semibold text-md">
              New Content
            </span>
            <Button
              onClick={() => setIsViewNotifications(true)}
              className="bg-blue-500 text-white hover:bg-blue-600 hover:duration-300"
            >
              View
            </Button>
          </div>
        )}
        {/* Description */}
        {/* <p className="text-gray-600 text-center max-w-sm">
          Master concepts with interactive lessons, quick quizzes, and step-by-step solutions
          —tailored for your success!
        </p> */}

        {/* Get Started Button */}
        <Button
          onClick={handleGetStarted}
          className=" w-full fixed bottom-8 max-w-xs bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg"
        >
          GET STARTED
        </Button>
      </div>
      <Dialog open={isViewNotifications} onOpenChange={setIsViewNotifications}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Content</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            {notifications.map((notification, index) => {
              return (
                <div
                  key={notification.id}
                  className={`flex items-center justify-between text-gray-600 font-semibold border-b p-1 ${
                    index !== notifications.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="flex flex-wrap w-3/5">
                    {notification.message}
                  </div>
                  <div>{formatDate(notification.createdAt, "d/M/y")}</div>
                </div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              noOfPages={totalPages}
              setCurrentPage={setPage}
            />
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"outline"}>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;
