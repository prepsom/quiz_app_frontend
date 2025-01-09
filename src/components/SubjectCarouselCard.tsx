import { useCompletedLevelsBySubject } from "@/hooks/useCompletedLevelsBySubject";
import { useLevelsBySubject } from "@/hooks/useLevelsBySubject";
import { SubjectType } from "@/types";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "./ui/progress";

type Props = {
  subject: SubjectType;
  icon: string | JSX.Element;
};

const SubjectCarouselCard = ({ subject, icon }: Props) => {

  const { isLoading: isTotalLevelsLoading, levels: totalLevels } = useLevelsBySubject(subject.id);
  const { completedLevels, isLoading: isCompletedLevelsLoading } = useCompletedLevelsBySubject(subject.id);
  const navigate = useNavigate();

  if (isTotalLevelsLoading || isCompletedLevelsLoading) {
    return (
      <div className="flex items-center justify-center w-56 h-56 bg-[#ecfbff] rounded-2xl">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const progressPercentage = (completedLevels.length / totalLevels.length) * 100;

  return (
    <div
      onClick={() => navigate(`${subject.subjectName!=="Science" ? '/subjects' : `/levels/${subject.id}`}`)}
      key={subject.id}
      className={`flex flex-col w-56 h-56 items-center justify-between p-6 ${subject.subjectName==="Science" ? 'bg-[#ecfbff]' : 'bg-gray-200'} rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group`}
    >
      <div className="group-hover:scale-110 transition-transform duration-200">
        <div className="text-blue-600">
          {typeof icon === "string" ? (
            <img className="w-32 h-32 object-contain" src={icon} alt="" />
          ) : (
            icon
          )}
        </div>
      </div>
      <div className="w-full">
        <div className="text-lg font-normal text-[#46557B] group-hover:text-blue-600 transition-colors duration-200">
          {subject.subjectName} Quiz
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="font-semibold text-[#C6C1E0]">
            {totalLevels.length} Levels
          </div>
          <Progress
            value={progressPercentage}
            className="h-2 bg-blue-100 w-1/2"
            indicatorClassName="bg-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default SubjectCarouselCard;
