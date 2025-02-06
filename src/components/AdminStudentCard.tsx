import { UserType } from "@/types";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useUserTotalPointsById } from "@/hooks/useUserTotalPointsById";
import coin3DIcon from "../assets/3DCoinsIcon.png"
import { Loader } from "lucide-react";

type Props = {
  student: UserType;
};

const AdminStudentCard = ({ student }: Props) => {
  // get the user's total points
  const navigate = useNavigate();
  const { isLoading: isTotalPointsLoading, totalPoints } =
    useUserTotalPointsById(student.id);

  return (
    <div className="flex items-center justify-between w-full px-8 bg-white py-4">
      <div className="flex flex-col w-full gap-2">
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold text-gray-700">
            {student.name}
          </div>
        </div>
        <div className="text-md font-medium text-gray-500">{student.email}</div>
        <div>
          <Button
            onClick={() => navigate(`/admin/profile/${student.id}`)}
            variant={"outline"}
            className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white hover:duration-300"
          >
            View Profile
          </Button>
        </div>
      </div>
      {!isTotalPointsLoading && <div className="flex items-center justify-center gap-2">
        <img src={coin3DIcon} alt=""/>
        <span className="text-lg font-semibold">{totalPoints}</span>
      </div>}
      {isTotalPointsLoading && <Loader/>}
    </div>
  );
};

export default AdminStudentCard;
