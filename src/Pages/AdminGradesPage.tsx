import { useGradesBySchool } from "@/hooks/useGradesBySchool";
import { ArrowLeft, Loader } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import RkInstitute from "../assets/RKInstituteLogo.png";
import RadiantInstitute from "../assets/RadiantInstituteLogo.png";
import owlMascotImage from "../assets/owl_image.png";
import { useGetSchoolById } from "@/hooks/useGetSchoolById";
import { Button } from "@/components/ui/button";

const schoolIconMap = new Map<string, string>([
  ["Radha Krishna Educational Institute", RkInstitute],
  ["Radiant group tuitions", RadiantInstitute],
  ["PrepSOM School", owlMascotImage],
]);

const AdminGradesPage = () => {
  const navigate = useNavigate();
  const { schoolId } = useParams<{ schoolId: string }>();
  const { isLoading: isSchoolLoading, school } = useGetSchoolById(schoolId!);
  const { grades, isLoading: isGradesLoading } = useGradesBySchool(schoolId!);

  if (isGradesLoading || isSchoolLoading) {
    return (
      <>
        <div className="flex items-center justify-center mt-28">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center bg-[#ecfbff] min-h-screen">
        <div className="flex flex-col w-full px-8 gap-4">
          <div className="flex items-center justify-start w-full my-8">
            <Link to="/admin/schools" className="flex items-center gap-2 text-blue-500">
              <ArrowLeft/>
              Back to schools
            </Link>
          </div>
          <div className="flex items-center justify-center w-fit mx-auto mt-4">
            <img
              className="aspect-auto w-36"
              src={schoolIconMap.get(school?.schoolName!)}
              alt=""
            />
          </div>
          <h1 className="text-xl font-semibold text-blue-500">
            Welcome to {school?.schoolName}
          </h1>
          <p className="text-gray-600 font-semibold">Please select a grade</p>
        </div>
        <div className="flex flex-col items-center w-full px-8 gap-4">
          {grades.map((grade) => {
            return (
              <div
                key={grade.id}
                className="bg-white flex flex-col justify-between p-4 w-full border-2 rounded-lg shadow-md"
              >
                <span className="text-gray-600 font-semibold">
                  Grade {grade.grade}
                </span>
              {grade._count && (
                  <span className="text-gray-600 font-semibold">
                    No of students : {grade._count.students}
                  </span>
                )}
                <div className="flex items-center gap-4 mt-4">
                  <Button onClick={() => navigate(`/admin/students/${grade.id}`)} variant="outline">View Students</Button>
                  <Button onClick={() => navigate(`/admin/subjects/${grade.id}`)} variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:duration-300">View Subjects</Button>
                </div>
                <div className="my-2">
                  <Button onClick={() => navigate(`/admin/notifications/${grade.id}`)} variant={"outline"}>View Notifications</Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AdminGradesPage;
