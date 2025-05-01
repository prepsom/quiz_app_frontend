import { AppContext } from "@/Context/AppContext";
import { useSubjectsByGrade } from "@/hooks/useSubjectsByGrade";
import { AppContextType } from "@/types";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SubjectCard } from "@/components/SubjectCard";
import SubjectsCarousel from "@/components/SubjectsCarousel";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BsQuestion } from "react-icons/bs";
import IncompleteLevels from "@/components/IncompleteLevels";
// import RkInstitute from "../assets/RKInstituteLogo.png";
// import RadiantInstitute from "../assets/RadiantInstituteLogo.png";
// import owlMascotImage from "../assets/owl_image.png";
// import { useGetSchoolNameByGrade } from "@/hooks/useGetSchoolName";

// const schoolIconMap = new Map<string, string>([
//   ["Radha Krishna Educational Institute", RkInstitute],
//   ["Radiant group tuitions", RadiantInstitute],
//   ["PrepSOM School", owlMascotImage],
// ]);

export default function SubjectsPage() {
  const { loggedInUser } = useContext(AppContext) as AppContextType;
  if (loggedInUser === null) return <Navigate to="/login" />;
  const { subjects, isLoading } = useSubjectsByGrade(loggedInUser?.gradeId);
  const [isContactInfoOpen, setIsContactInfoOpen] = useState<boolean>(false);
  // const { schoolName, isLoading: isSchoolNameLoading } =
  //   useGetSchoolNameByGrade(loggedInUser.gradeId);

  // const schoolIconImage = useMemo(() => {
  //   if (schoolName === "" || isSchoolNameLoading) return;
  //   return schoolName !== "" && !isSchoolNameLoading
  //     ? schoolIconMap.get(schoolName)
  //     : "";
  // }, [schoolName]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white border min-h-screen">
      <div className="p-4 flex flex-col justify-center gap-2">
        <div className="flex items-center justify-between">
          <div className="text-gray-500 mt-4">Hello {loggedInUser.name}!</div>
          {/* <div className="rounded-full w-12 h-12 flex items-center justify-center p-1 border-2 border-blue-300 bg-[#ecfbff]">
            <img src={schoolIconImage} alt="" />
          </div> */}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-2xl text-gray-600 font-semibold ">
            {" "}
            What would you like to learn today{" "}
          </span>
          <div className="text-gray-600 border-2 border-gray-700 rounded-full">
            <BsQuestion onClick={() => setIsContactInfoOpen(true)} />
          </div>
        </div>
      </div>

      <SubjectsCarousel subjects={subjects} />

      <IncompleteLevels />

      <div className="p-4 flex items-center my-2 text-2xl font-semibold text-gray-700">
        Unfinished games
      </div>
      <div className="max-w-lg mx-auto p-4 space-y-4">
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
      <AlertDialog open={isContactInfoOpen} onOpenChange={setIsContactInfoOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Contact information for feedback
            </AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center justify-start gap-2">
            <span className="text-gray-600 font-semibold">Contact Email:-</span>
            <span>contact@prepsom.com</span>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
