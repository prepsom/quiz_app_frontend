import { API_URL } from "@/App";
import AdminSubjectCard from "@/components/AdminSubjectCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useGetGradeById } from "@/hooks/useGetGradeById";
import { useSubjectsByGrade } from "@/hooks/useSubjectsByGrade";
import { SubjectType } from "@/types";
import axios from "axios";
import { ArrowLeft, Loader, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const AdminSubjectsPage = () => {
  const { toast } = useToast();
  const { gradeId } = useParams<{ gradeId: string }>();
  const {
    subjects,
    isLoading: isSubjectsLoading,
    setSubjects,
  } = useSubjectsByGrade(gradeId!);
  const { grade, isLoading: isGradeLoading } = useGetGradeById(gradeId!);
  const [isCreateSubjectModalOpen, setIsCreateSubjectModalOpen] =
    useState<boolean>(false);
  const [subjectName, setSubjectName] = useState<string>("");
  const [isAddingSubject, setIsAddingSubject] = useState<boolean>(false);

  const handleAddSubject = async () => {
    if (!subjectName.trim()) return;
    if (!grade) return;
    try {
      setIsAddingSubject(true);
      const response = await axios.post<{
        success: boolean;
        subject: SubjectType;
      }>(
        `${API_URL}/subject`,
        {
          subjectName: subjectName.trim(),
          gradeId: grade.id,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setSubjects((prevSubjects) => [...prevSubjects, response.data.subject]);
      toast({
        title: "Subject added successfully",
        description: "Subject has been added to the grade",
        variant: "default",
      });
      setSubjectName("");
      setIsCreateSubjectModalOpen(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to add subject",
        description: "Please check your internet connection and try again",
        variant: "destructive",
      });
    } finally {
      setIsAddingSubject(false);
    }
  };

  if (isSubjectsLoading || isGradeLoading) {
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
          <h1 className="text-xl text-gray-600 font-semibold">
            Grade not found
          </h1>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center bg-[#ecfbff] min-h-screen">
        <div className="flex items-center justify-start w-full px-8 my-8">
          <Link
            className="text-blue-500 font-semibold flex items-center gap-2"
            to={`/admin/grades/${grade.schoolId}`}
          >
            <ArrowLeft/>
            Back to grades
          </Link>
        </div>
        <div className="flex flex-col w-full px-8 gap-4">
          <h1 className="text-xl font-semibold text-blue-500">
            Welcome to class {grade.grade}
          </h1>
          <p className="text-gray-600 font-semibold">
            Create,delete and manage subjects for this grade
          </p>
        </div>
        <div className="flex items-center justify-start w-full px-8 my-2">
          <Button
            onClick={() => setIsCreateSubjectModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 hover:duration-300"
          >
            <PlusCircle />
            <span>Add Subject</span>
          </Button>
        </div>
        <div className="flex flex-col items-center w-full px-8 gap-4 py-4">
          {subjects.map((subject: SubjectType) => {
            return (
              <AdminSubjectCard
                key={subject.id}
                subject={subject}
                setSubjects={setSubjects}
              />
            );
          })}
        </div>
      </div>
      <Dialog
        open={isCreateSubjectModalOpen}
        onOpenChange={setIsCreateSubjectModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subject</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="subjectName">Subject Name</Label>
            <Input
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              type="text"
              id="subjectName"
              placeholder="Enter subject name"
            />
          </div>
          <DialogFooter>
            <DialogClose disabled={isAddingSubject} asChild>
              <Button variant={"outline"}>Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleAddSubject}
              disabled={isAddingSubject || subjectName.trim() === ""}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminSubjectsPage;
