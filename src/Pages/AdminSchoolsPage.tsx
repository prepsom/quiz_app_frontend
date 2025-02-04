import { AppContext } from "@/Context/AppContext";
import { useGetSchools } from "@/hooks/useGetSchools";
import { AppContextType, School } from "@/types";
import { Loader } from "lucide-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminSchoolsPage = () => {
  const navigate = useNavigate();
  const { schools, isLoading: isSchoolsLoading } = useGetSchools();
  const { loggedInUser } = useContext(AppContext) as AppContextType;

  if (isSchoolsLoading) {
    return (
      <>
        <div className="mt-28 flex items-center justify-center">
          <Loader />
        </div>
      </>
    );
  }

  if (!isSchoolsLoading && !loggedInUser) {
    return (
      <>
        <div className="flex items-center mt-28 font-semibold gap-2">
          <span>Please Login to access this content</span>
          <Link to="/login">Click here</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center bg-[#ecfbff] h-screen">
        <div className="mt-14 flex flex-col gap-2 px-8">
          <h1 className="text-blue-500 text-2xl font-semibold ">
            Welcome Admin {loggedInUser?.name}
          </h1>
          <p className="text-gray-600 font-semibold">
            Please go through the onboarding process by selecting the school and
            the respective class you want to Admin in. Don't worry , schools and
            classes can be switched later aswell.
          </p>
        </div>
        <div className="flex items-center text-blue-600 justify-center w-full my-4 font-semibold text-xl px-8">
          Our Institutes
        </div>
        <div className="flex flex-col items-center gap-4 px-8 py-4 mb-4 w-full">
          {schools.map((school: School) => {
            return (
              <div
                onClick={() => navigate(`/admin/grades/${school.id}`)}
                key={school.id}
                className="rounded-lg p-4 flex items-center font-semibold text-gray-700 text-lg justify-start bg-white shadow-md hover:shadow-md hover:duration-300 w-full"
              >
                {school.schoolName}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AdminSchoolsPage;
