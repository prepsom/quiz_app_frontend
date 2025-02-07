import { useLevelsBySubject } from "@/hooks/useLevelsBySubject";
import { AppContextType, SubjectType } from "@/types";
import React, { useContext, useState } from "react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import axios from "axios";
import { API_URL } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Navigate, useNavigate } from "react-router-dom";
import { AppContext } from "@/Context/AppContext";

type Props = {
  subject: SubjectType;
  setSubjects: React.Dispatch<React.SetStateAction<SubjectType[]>>;
};

const AdminSubjectCard = ({ subject, setSubjects }: Props) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { levels, isLoading: isLevelsLoading } = useLevelsBySubject(subject.id);
  const [isDeleteSubjectAlertOpen, setIsDeleteSubjectAlertOpen] =
    useState<boolean>(false);
  const [isEditSubjectModalOpen, setIsEditSubjectModalOpen] =
    useState<boolean>(false);
  const [deleteSubjectConfirmation, setDeleteSubjectConfirmation] =
    useState<string>("");
  const DELETE_SUBJECT_CONFIRMATION_COMMAND = `DELETE SUBJECT ${subject.subjectName}`;
  const isDeleteSubjectConfirmationCorrect =
    deleteSubjectConfirmation === DELETE_SUBJECT_CONFIRMATION_COMMAND;
  const [isDeletingSubject, setIsDeletingSubject] = useState<boolean>(false);
  const [isEditingSubject, setIsEditingSubject] = useState<boolean>(false);
  const [newSubjectName, setNewSubjectName] = useState<string>(
    subject.subjectName
  );
  const {loggedInUser} = useContext(AppContext) as AppContextType;
  if(loggedInUser===null) return <Navigate to="/"/>
  const role = loggedInUser.role==="ADMIN" ? "admin" : loggedInUser.role==="TEACHER" ? "teacher" : "student";
  if(role==="student") return <Navigate to="/"/>

  const handleDeleteSubject = async () => {
    try {
      setIsDeletingSubject(true);
      await axios.delete(`${API_URL}/subject/${subject.id}`, {
        withCredentials: true,
      });
      setSubjects((prevSubjects) =>
        prevSubjects.filter((sub) => sub.id !== subject.id)
      );
      toast({
        title: "Subject deleted successfully",
        description: "subject deleted successfully",
        variant: "default",
      });
      setIsDeleteSubjectAlertOpen(false);
    } catch (error) {
      toast({
        title: "Error deleting subject",
        description: "check your network connection",
        variant: "destructive",
      });
    } finally {
      setIsDeletingSubject(false);
    }
  };

  // when the save button is clicked , the user is updating the subjectname for this component
  const handleEditSubject = async () => {
    if (newSubjectName.trim() === "") return;
    try {
      setIsEditingSubject(true);
      const response = await axios.put<{
        success: boolean;
        message: string;
        subject: SubjectType;
      }>(
        `${API_URL}/subject/${subject.id}`,
        {
          newSubjectName: newSubjectName.trim(),
        },
        {
          withCredentials: true,
        }
      );
      setSubjects((prevSubjects) => {
        const updatedSubjects = prevSubjects.map((sub) => {
          if (sub.id === subject.id) {
            return response.data.subject;
          } else {
            return sub;
          }
        });

        return updatedSubjects;
      });

      toast({
        title: "Subject updated successfully",
        description: "subject updated successfully",
        variant: "default",
      });
      setIsEditSubjectModalOpen(false);
    } catch (error) {
      toast({
        title: "Error updating subject",
        description: "check your network connection",
        variant: "destructive",
      });
    } finally {
      setIsEditingSubject(false);
    }
  };
  
  const toggleEditSubjectModal = () => {
    if(isEditSubjectModalOpen) {
        setIsEditSubjectModalOpen(false);
    } else {
        setIsEditSubjectModalOpen(true);
        setNewSubjectName(subject.subjectName);
    }
  }

  return (
    <>
      <div className="flex flex-col justify-between bg-white shadow-md rounded-lg p-4 w-full">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="text-xl font-semibold text-gray-600">
              {subject.subjectName}
            </div>
            {isLevelsLoading ? (
              <div>
                <Loader />
              </div>
            ) : (
              <>
                <div className="text-sm font-semibold text-gray-600">
                  {levels.length} levels
                </div>
              </>
            )}
          </div>
          <div>
            <Button onClick={() => navigate(`/${role}/levels/${subject.id}`)} variant="outline">View Levels</Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Button
            onClick={toggleEditSubjectModal}
            className="border-2 bg-white border-blue-500 text-blue-500 hover:bg-blue-500 hover:duration-300 hover:text-white"
          >
            Edit
          </Button>
          <Button
            onClick={() => setIsDeleteSubjectAlertOpen(true)}
            className="border-2 bg-white border-red-500 text-red-500 hover:bg-red-500 hover:duration-300 hover:text-white"
          >
            Delete
          </Button>
        </div>
        <AlertDialog
          open={isDeleteSubjectAlertOpen}
          onOpenChange={setIsDeleteSubjectAlertOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete "{subject.subjectName}"?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action will lead to the deletion of all levels associated
                with this subject.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* make a confirmation input to type the exact command mentioned to delete the subject */}
            <div className="flex flex-col gap-2  w-full justify-center">
              <Label>
                Confirmation Command : "{DELETE_SUBJECT_CONFIRMATION_COMMAND}"
              </Label>
              <Input
                value={deleteSubjectConfirmation}
                onChange={(e) => setDeleteSubjectConfirmation(e.target.value)}
                type="text"
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingSubject}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 text-white hover:bg-red-600 hover:duration-300"
                onClick={handleDeleteSubject}
                disabled={
                  !isDeleteSubjectConfirmationCorrect || isDeletingSubject
                }
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Dialog
          open={isEditSubjectModalOpen}
          onOpenChange={toggleEditSubjectModal}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Subject</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label>Subject Name</Label>
              <Input
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                type="text"
              />
            </div>
            <DialogFooter>
              <DialogClose disabled={isEditingSubject} asChild>
                <Button variant={"outline"}>Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleEditSubject}
                disabled={isEditingSubject || newSubjectName.trim() === ""}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminSubjectCard;
