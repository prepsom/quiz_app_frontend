import { LevelType } from "@/types";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import levelLocked3DIcon from "../assets/LevelLockedIcon.png";
import star3DIcon from "../assets/star3DIcon.png";

interface LevelCardProps {
  level: LevelType;
  isLocked: boolean;
  isCompleted: boolean;
  index: number;
}

export function LevelCard({
  level,
  isLocked,
  isCompleted,
  index,
}: LevelCardProps) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (isLocked) {
      return;
    }
    navigate(`/level/${level.id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="flex items-center gap-4 cursor-pointer hover:shadow-md hover:duration-300 px-4 py-2 rounded-lg"
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center ${
          isCompleted
            ? "bg-green-100 border-2 border-green-500"
            : isLocked
            ? "bg-gray-100"
            : "bg-[#ecfbff]"
        }`}
      >
        {isCompleted ? (
          <CheckCircle className="w-6 h-6 text-green-500" />
        ) : isLocked ? (
          <>
            <img src={levelLocked3DIcon} alt="" />
          </>
        ) : (
          <img src={star3DIcon} alt="" />
        )}
      </div>

      <div className="flex-1">
        <div className="text-sm text-blue-500 font-light uppercase">
          LEVEL {index + 1}
        </div>
        <h3
          className={`text-lg text-[#374151] font-bold ${
            isLocked ? "text-[#9ca3af]" : ""
          } `}
        >
          {level.levelName}
        </h3>
        {level.levelDescription && (
          <p className="text-sm text-gray-500">{level.levelDescription}</p>
        )}
      </div>
    </div>
  );
}
