import { AppContext } from "@/Context/AppContext";
import { useSubjectsByGrade } from "@/hooks/useSubjectsByGrade";
import { AppContextType } from "@/types";
import { Loader } from "lucide-react";
import { useContext } from "react";
import ProfileSubjectCard from "./ProfileSubjectCard";

const UsersSubjectProgression = () => {
  const { loggedInUser } = useContext(AppContext) as AppContextType;
  if (loggedInUser === null) return;
  const { subjects, isLoading: isSubjectsLoading } = useSubjectsByGrade(
    loggedInUser?.gradeId
  );

  if (isSubjectsLoading) {
    return (
      <>
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {subjects.map((subject) => {
          return <ProfileSubjectCard subject={subject} key={subject.id} />;
        })}
      </div>
    </>
  );
};

export default UsersSubjectProgression;
