import { SubjectType } from "@/types";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Book } from "lucide-react";
import { useLevelsBySubject } from "@/hooks/useLevelsBySubject";
import { useCompletedLevelsBySubject } from "@/hooks/useCompletedLevelsBySubject";
import { Skeleton } from "./ui/skeleton";
import { ProgressCircle } from "./ProgressCircle";
import mathsImageIcon from "../assets/MathImageIcon.png";
import scienceImageIcon from "../assets/ScienceImageIcon.png";
import computerImageIcon from "../assets/ComputerImageIcon.png";
import aiImageIcon from "../assets/AiIcon.png";
import englishIcon from "../assets/englishIcon.png"

const subjectImageIcons = {
  mathematics: mathsImageIcon,
  science: scienceImageIcon,
  computer: computerImageIcon,
  "artificial intelligence": aiImageIcon,
  "english":englishIcon
} as const;

interface SubjectCardProps {
  subject: SubjectType;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const navigate = useNavigate();
  const Icon =
    subjectImageIcons[
      subject.subjectName.trim().toLowerCase() as keyof typeof subjectImageIcons
    ] || Book;
  const { levels: totalLevels, isLoading: isTotalLevelsLoading } =
    useLevelsBySubject(subject.id);
  const { completedLevels, isLoading: isCompletedLevelsLoading } =
    useCompletedLevelsBySubject(subject.id);

  const progress =
    totalLevels.length > 0
      ? Math.round((completedLevels.length / totalLevels.length) * 100)
      : 0;

  if (progress == 100) return;

  if (isTotalLevelsLoading || isCompletedLevelsLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`${
        totalLevels.length === 0 ? "grayscale" : ""
      } p-4 hover:shadow-md transition-shadow bg-white rounded-xl cursor-pointer`}
      onClick={() => {
        if (totalLevels.length !== 0) {
          navigate(`/levels/${subject.id}`);
        } else {
          navigate(`/subjects`);
        }
      }}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          {typeof Icon === "string" ? (
            <>
              {" "}
              <img className="w-12 h-12" src={Icon} alt="" />
            </>
          ) : (
            <Icon className="w-6 h-6 text-blue-500" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{subject.subjectName}</h3>
          <p className="text-sm text-gray-500">
            {completedLevels.length} of {totalLevels.length} levels completed
          </p>
        </div>

        <div className="relative">
          <ProgressCircle
            progress={progress}
            className={`relative ${
              progress >= 66
                ? "stroke-green-500"
                : progress >= 33
                ? "stroke-blue-500"
                : "stroke-orange-500"
            }`}
          />
        </div>
      </div>
    </Card>
  );
}
