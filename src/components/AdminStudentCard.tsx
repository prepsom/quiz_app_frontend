import { AppContextType, UserType } from "@/types";
import { Button } from "./ui/button";
import { Navigate, useNavigate } from "react-router-dom";
import { useUserTotalPointsById } from "@/hooks/useUserTotalPointsById";
import coin3DIcon from "../assets/3DCoinsIcon.png";
import { Loader } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "@/Context/AppContext";

type Props = {
  student: UserType;
};

const AdminStudentCard = ({ student }: Props) => {
  // get the user's total points
  const navigate = useNavigate();
  const { isLoading: isTotalPointsLoading, totalPoints } =
    useUserTotalPointsById(student.id);
  const { loggedInUser } = useContext(AppContext) as AppContextType;
  const role =
    loggedInUser?.role === "ADMIN"
      ? "admin"
      : loggedInUser?.role === "TEACHER"
      ? "teacher"
      : "student";
  if (role === "student") return <Navigate to="/" />;

  return (
    <div className="flex items-center justify-between w-full px-8 bg-white py-4 rounded-lg shadow-md">
      <div className="flex flex-col w-full gap-2">
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold text-gray-700">
            {student.name}
          </div>
        </div>
        <div className="text-md font-medium text-gray-500">{student.email}</div>
        <div>
          <Button
            onClick={() => navigate(`/${role}/profile/${student.id}`)}
            variant={"outline"}
            className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white hover:duration-300"
          >
            View Profile
          </Button>
        </div>
        {!isTotalPointsLoading && (
          <div className="flex items-center gap-2">
            <img src={coin3DIcon} alt="" />
            <span className="text-lg font-semibold">{totalPoints}</span>
          </div>
        )}
        {isTotalPointsLoading && <Loader />}
      </div>
    </div>
  );
};

export default AdminStudentCard;
