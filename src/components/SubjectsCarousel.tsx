import { SubjectType } from "@/types";
import { Book, ComputerIcon } from "lucide-react";
import scienceSubjectImage from "../assets/scienceSubjectIcon (2).png";
import mathSubjectImage from "../assets/MathSubjectIcon (2).png";
import aiSubjectImage from "../assets/AiIcon.png";
import SubjectCarouselCard from "./SubjectCarouselCard";
import englishIcon from "../assets/englishIcon.png"

type Props = {
  subjects: SubjectType[];
};

const subjectImages = {
  science: scienceSubjectImage,
  mathematics: mathSubjectImage,
  computer: <ComputerIcon />,
  "artificial intelligence": aiSubjectImage,
  "english":englishIcon,
};

const SubjectsCarousel = ({ subjects }: Props) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto pb-4">
        {subjects.map((subject: SubjectType) => {
          const icon = subjectImages[
            subject.subjectName
              .trim()
              .toLowerCase() as keyof typeof subjectImages
          ] || <Book className="w-6 h-6" />;
          return (
            <SubjectCarouselCard
              key={subject.id}
              icon={icon}
              subject={subject}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SubjectsCarousel;
