// import { useParams } from 'react-router-dom'

import AdminStudentCard from "@/components/AdminStudentCard";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppContext } from "@/Context/AppContext";
import { useGetGradeById } from "@/hooks/useGetGradeById";
import { useStudentsByGrade } from "@/hooks/useStudentsByGrade";
import { AppContextType } from "@/types";
import { ArrowLeft, Loader } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

const STUDENTS_PER_PAGE = 10;

const SORY_BY_OPTIONS = ["asc", "desc", "none"];

const AdminStudentsPage = () => {
  const { gradeId } = useParams<{ gradeId: string }>();
  const [page, setPage] = useState<number>(1);
  // fetch students in a particular grade
  const { grade, isLoading: isGradeLoading } = useGetGradeById(gradeId!);
  const [searchByEmailOrName, setSearchByEmailOrName] = useState<string>("");
  const [filterByNameOrEmail, setFilterByNameOrEmail] = useState<string>("");
  const [sortByTotalPoints, setSortByTotalPoints] = useState<string>("none");
  const {
    students,
    isLoading: isStudentsLoading,
    totalPages,
  } = useStudentsByGrade(
    gradeId!,
    page,
    STUDENTS_PER_PAGE,
    searchByEmailOrName.trim() === "" ? undefined : searchByEmailOrName,
    sortByTotalPoints === "none"
      ? undefined
      : (sortByTotalPoints as "asc" | "desc")
  );
  const { loggedInUser } = useContext(AppContext) as AppContextType;
  if (loggedInUser === null) return <Navigate to="/" />;
  const role =
    loggedInUser.role === "ADMIN"
      ? "admin"
      : loggedInUser.role === "TEACHER"
      ? "teacher"
      : "student";
  if (role === "student") return <Navigate to="/" />;

  const handleSearchUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchByEmailOrName(filterByNameOrEmail.trim());
  };

  const backToGradesPath = (role: "teacher" | "admin") => {
    let path;

    if (role === "admin") {
      path = `/admin/grades/${grade?.schoolId}`;
    } else {
      path = `/teacher/grades`;
    }

    return path;
  };

  useEffect(() => setPage(1), [sortByTotalPoints, searchByEmailOrName]);

  if (isStudentsLoading || isGradeLoading) {
    return (
      <>
        <div className="flex items-center justify-center mt-28">
          <Loader />
        </div>
      </>
    );
  }

  if (!grade) {
    return (
      <>
        <div className="flex items-center justify-center mt-28">
          <h1 className="text-2xl font-semibold text-gray-600">
            Grade not found
          </h1>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center w-full bg-[#ecfbff] min-h-screen">
        <div className="flex items-center justify-start w-full px-8 mt-14 mb-2">
          <Link
            to={backToGradesPath(role)}
            className="text-blue-500 font-semibold flex items-center gap-2"
          >
            <ArrowLeft />
            Back to grades
          </Link>
        </div>
        <div className="flex flex-col items-start w-full px-8 mb-4">
          <h1 className="text-xl text-gray-600 font-semibold">
            Welcome to Grade {grade.grade}
          </h1>
          <p className="text-md text-gray-500 font-semibold">
            Manage and view students in grade {grade.grade}
          </p>
        </div>
        <div className="flex items-center justify-center w-full px-8 my-4 gap-2">
          <form
            onSubmit={(e) => handleSearchUser(e)}
            className="flex items-center justify-center gap-4"
          >
            <Input
              value={filterByNameOrEmail}
              onChange={(e) => setFilterByNameOrEmail(e.target.value)}
              type="text"
              name="filterByNameOrEmail"
              placeholder="Search user"
            />
            <Button
              variant="outline"
              className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white hover:duration-300"
            >
              Search
            </Button>
          </form>
          <Button
            variant="outline"
            onClick={() => {
              setSearchByEmailOrName("");
              setFilterByNameOrEmail("");
            }}
          >
            Clear
          </Button>
        </div>
        <div className="flex items-center w-full py-4 px-8 rounded-lg mx-8 flex-wrap gap-2">
          <div className="bg-white">
            <Select
              value={sortByTotalPoints}
              onValueChange={(value) => setSortByTotalPoints(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by total points" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort by total points</SelectLabel>
                  {SORY_BY_OPTIONS.map((option) => {
                    return (
                      <SelectItem value={option} key={option}>
                        {option === "asc"
                          ? "lowest to highest"
                          : option === "desc"
                          ? "highest to lowest"
                          : "none"}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col items-center w-full px-8 gap-2">
          {students.length > 0 &&
            students.map((student) => {
              return <AdminStudentCard student={student} key={student.id} />;
            })}
          {students.length === 0 && (
            <div className="flex items-center justify-center mx-4">
              <h1 className="text-xl font-semibold text-gray-500">
                No students found on this page
              </h1>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center w-full px-8 my-2">
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              noOfPages={totalPages}
              setCurrentPage={setPage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AdminStudentsPage;
