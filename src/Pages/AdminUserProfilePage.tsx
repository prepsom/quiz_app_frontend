import { useUserDataById } from "@/hooks/useUserDataById";
import { ArrowLeft, Loader, User } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import maleAvatar from "../assets/MaleAvatar.jpeg";
import femaleAvatar from "../assets/FemaleAvatar.jpeg";
import coin3DIcon from "../assets/3DCoinsIcon.png";
import { AppContextType, LevelWithMetaData, UserCompleteLevelType } from "@/types";
import LevelWithMetaDataCard from "@/components/LevelWithMetaDataCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContext } from "react";
import { AppContext } from "@/Context/AppContext";

const AdminUserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { userData, isLoading: isUserDataLoading } = useUserDataById(userId!);
  const {loggedInUser} = useContext(AppContext) as AppContextType;
  const role = loggedInUser?.role==="ADMIN" ? "admin" : loggedInUser?.role==="TEACHER" ? "teacher" : "student";
  if(role==="student") return <Navigate to="/"/>



  if (isUserDataLoading) {
    return (
      <>
        <div className="flex items-center justify-center mt-28">
          <Loader />
        </div>
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <div className="flex items-center justify-center mt-28">
          <h1 className="text-gray-700 font-semibold text-xl">
            User not found
          </h1>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center w-full bg-[#ecfbff] min-h-screen">
        <div className="flex items-center w-full justify-center text-white font-sembold text-2xl bg-blue-500 p-4">
          <User />
          <h1>Profile</h1>
        </div>

        <div className="flex flex-col w-full items-center px-8">
          <div className="flex items-center justify-start w-full">
            <Link to={`/${role}/students/${userData.gradeId}`} className="flex items-center gap-2 text-blue-500 font-semibold mt-4">
              <ArrowLeft/>
              Back to students
            </Link>
          </div>
          <div className="flex flex-col w-full px-8 py-4 border-2 rounded-lg shadow-md mt-12 bg-white">
            <div className="text-gray-600 font-semibold text-xl mb-2">
              {userData?.role}
            </div>
            <div className="flex items-center gap-4">
              {userData.avatar === "MALE" ? (
                <>
                  <Avatar>
                    <AvatarImage src={maleAvatar} />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                </>
              ) : (
                <>
                  <Avatar>
                    <AvatarImage src={femaleAvatar} />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                </>
              )}
              <div className="flex flex-col gap-2">
                <div className="text-gray-700 font-semibold text-xl">
                  {userData.name}
                </div>
                <div className="text-gray-500 font-semibold text-sm">
                  {userData.email}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <img src={coin3DIcon} alt="" />
              <div className="font-semibold text-lg">
                {userData.totalPoints}
              </div>
            </div>
          </div>

          {userData.userCompletedLevels.length > 0 ?  <div className="flex flex-col w-full px-8 border-2 rounded-lg shadow-md p-4 bg-white my-8">
            <div className="flex items-center text-gray-700 font-semibold text-xl">
              Completed Levels
            </div>
            <div className="flex flex-col gap-2 items-center justify-center">
              {userData.userCompletedLevels.map(
                (userCompletedLevel: UserCompleteLevelType) => {
                  const levelWithMetaData: LevelWithMetaData = {
                    ...userCompletedLevel.level!,
                    subject: userCompletedLevel.level?.subject!,
                    totalPoints: userCompletedLevel.totalPoints,
                    strengths: userCompletedLevel.strengths,
                    weaknesses: userCompletedLevel.weaknesses,
                    recommendations: userCompletedLevel.recommendations,
                    noOfCorrectQuestions:
                      userCompletedLevel.noOfCorrectQuestions,
                  };
                  return (
                    <LevelWithMetaDataCard
                      key={userCompletedLevel.id}
                      levelWithMetaData={levelWithMetaData}
                    />
                  );
                }
              )}
            </div>
          </div> : <div className="flex item-center justify-center mt-8 text-gray-600 font-semibold text-xl">
              No Completed Levels
            </div>}
        </div>
      </div>
    </>
  );
};

export default AdminUserProfilePage;
