import { useQuestionWithAnswers } from "@/hooks/useQuestionWithAnswers";
import { AnswerType, QuestionType } from "@/types";
import { CheckCircle, CirclePlusIcon, Loader, PencilIcon, TrashIcon, XCircle } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import axios from "axios";
import { API_URL } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = {
  question: QuestionType;
  searchByTitle?: string;
  setQuestions:React.Dispatch<React.SetStateAction<QuestionType[]>>;
  setIsAddMcqAnswerModalOpenForQuestion:React.Dispatch<React.SetStateAction<{
    question: QuestionType | null;
    isOpen: boolean;
}>>;
  setMcqAnswers:React.Dispatch<React.SetStateAction<{
    value: string;
    isCorrect: boolean;
}[]>>;
};

// the searcByTitle prop is present / defined when the user has searched for a question by title
// so highlight the searchByTitle text in the question title

const AdminMcqQuestionCard = ({ question, searchByTitle,setQuestions,setIsAddMcqAnswerModalOpenForQuestion,setMcqAnswers}: Props) => {
  const {toast} = useToast();
  const {
    question: questionWithAnswers,
    isLoading: isQuestionWithAnswersLoading,
  } = useQuestionWithAnswers(question.id);
  const [isShowMcqAnswers, setIsShowMcqAnswers] = useState<boolean>(false);
  const [isDeletingQuestion,setIsDeletingQuestion] = useState<boolean>(false);
  const [isDeleteQuestionAlertOpen,setIsDeleteQuestionAlertOpen] = useState<boolean>(false);
  const [deleteQuestionConfirmation,setDeleteQuestionConfirmation] = useState<string>("");
  const isDeleteQuestionConfirmationCorrect = deleteQuestionConfirmation.trim()==="CONFIRM DELETE QUESTION";

  const handleDeleteQuestion = async () => {
    try {
      setIsDeletingQuestion(true);
      const response =  await axios.delete<{success:boolean,message:string}>(`${API_URL}/question/${question.id}`,{
        withCredentials:true,
      });
      console.log(response);
      // if here then the question was deleted successfully
      // remove question with id==question.id from the questions array
      setQuestions((prevQuestions) => prevQuestions.filter((que) => que.id !== question.id));
      toast({
        title:"Question deleted successfully",
        description:response.data.message,
        variant:"default",
      });
      setIsDeleteQuestionAlertOpen(false);
      setDeleteQuestionConfirmation("");
    } catch (error) {
      console.log(error);
      toast({
        title:"Error deleting question",
        description:"Internal server error when deleting question",
        variant:"destructive",
      });
    } finally {
      setIsDeletingQuestion(false);
    }
  }


  if (isQuestionWithAnswersLoading) {
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
      <div className="flex flex-col w-full bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <BsThreeDots/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              {(question.ready===false && questionWithAnswers?.MCQAnswers?.length===0) && <>
                <DropdownMenuItem onClick={() =>  {
                setIsAddMcqAnswerModalOpenForQuestion({question:question,isOpen:true});
                setMcqAnswers(questionWithAnswers?.MCQAnswers?.map((mcqAnswer) => {
                  return {
                    value:mcqAnswer.value,
                    isCorrect:mcqAnswer.isCorrect
                  }
                }) || []);
              }}>
                <CirclePlusIcon/>
                Add Answers
              </DropdownMenuItem>
              </>}
              <DropdownMenuItem>
                <PencilIcon/>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" onClick={() => setIsDeleteQuestionAlertOpen(true)}>
                <TrashIcon/>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center flex-wrap text-gray-800 text-md">
          {searchByTitle !== undefined ? (
            <>
              {question.questionTitle
                .trim()
                .toLowerCase()
                .includes(searchByTitle.trim().toLowerCase()) ? (
                <>
                  <div className="flex items-center flex-wrap">
                    {
                      question.questionTitle
                        .trim()
                        .toLowerCase()
                        .split(searchByTitle.trim().toLowerCase())[0]
                    }
                    <span className="bg-cyan-500 text-white">
                      {searchByTitle}
                    </span>
                    {
                      question.questionTitle
                        .trim()
                        .toLowerCase()
                        .split(searchByTitle.trim().toLowerCase())[1]
                    }
                  </div>
                </>
              ) : (
                <>{question.questionTitle}</>
              )}
            </>
          ) : (
            question.questionTitle
          )}
        </div>
        <div className="flex items-center justify-start text-cyan-500 font-semibold">
          {question.difficulty}
        </div>
        <div className="flex items-center justify-between my-2">
          <span
            onClick={() => setIsShowMcqAnswers(!isShowMcqAnswers)}
            className="text-blue-500 font-semibold cursor-pointer"
          >
            {isShowMcqAnswers ? "Hide Answers" : "Show Answers"}
          </span>
          <span className="text-gray-500 font-semibold">
            {question.ready ? "Ready" : "Not Ready"}
          </span>
        </div>
        {isShowMcqAnswers && (
          <div className="flex flex-col gap-2">
            {questionWithAnswers?.MCQAnswers?.map((answer: AnswerType) => {
              return (
                <div
                  key={answer.id}
                  className="flex flex-col justify-start border-2 rounded-lg p-4"
                >
                  <div className="flex items-center justify-end mb-2">
                    {answer.isCorrect ? (
                      <CheckCircle className="text-green-500" />
                    ) : (
                      <XCircle className="text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center flex-wrap text-gray-600 font-semibold">
                    {answer.value}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <Dialog open={isDeleteQuestionAlertOpen} onOpenChange={setIsDeleteQuestionAlertOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Question</DialogTitle>
              <DialogDescription>Are you sure you want to delete this question? All answers related to this question will be deleted</DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col items-center w-full justify-center">
                <Label htmlFor="deleteQuestionConfirmation">Type "CONFIRM DELETE QUESTION" to delete the question</Label>
                <Input type="text" value={deleteQuestionConfirmation} onChange={(e) => setDeleteQuestionConfirmation(e.target.value)}/>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button disabled={!isDeleteQuestionConfirmationCorrect || isDeletingQuestion} onClick={handleDeleteQuestion} variant="destructive">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminMcqQuestionCard;
