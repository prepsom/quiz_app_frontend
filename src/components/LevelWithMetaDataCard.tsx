import { LevelWithMetaData } from "@/types";
import coin3DIcon from "../assets/3DCoinsIcon.png";
import { Check, CheckCircle, Loader, Percent } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useQuestionsByLevel } from "@/hooks/useQuestionsByLevel";
import { MAX_QUESTIONS_PER_LEVEL } from "@/Pages/LevelPage";

type Props = {
  levelWithMetaData: LevelWithMetaData;
};

const LevelWithMetaDataCard = ({ levelWithMetaData }: Props) => {
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] =
    useState<boolean>(false);
  const { questions, isLoading: isQuestionsLoading } = useQuestionsByLevel(
    levelWithMetaData.id
  );

  return (
    <>
      <div className="flex flex-col gap-2 p-2  w-full">
        <div className="text-gray-500 text-md font-light">
          {levelWithMetaData.subject.subjectName}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span className="text-lg font-bold text-gray-600 flex flex-wrap">
              {levelWithMetaData.levelName}
            </span>
          </div>
          <span className="text-gray-500 font-normal">
            {levelWithMetaData.levelDescription}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <img src={coin3DIcon} alt="" />
            <span className="font-bold">{levelWithMetaData.totalPoints}</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="text-green-500" />
            <span className="text-gray-600 font-semibold">
              {levelWithMetaData.noOfCorrectQuestions} /{" "}
              {questions.length < MAX_QUESTIONS_PER_LEVEL
                ? questions.length
                : MAX_QUESTIONS_PER_LEVEL}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Percent />
            {!isQuestionsLoading ? (
              <span className="text-gray-700 font-semibold">
                {(
                  (levelWithMetaData.noOfCorrectQuestions /
                    (questions.length < MAX_QUESTIONS_PER_LEVEL
                      ? questions.length
                      : MAX_QUESTIONS_PER_LEVEL)) *
                  100
                ).toFixed(2)}
              </span>
            ) : (
              <>
                <Loader />
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-start mt-4">
          <Button
            onClick={() => setIsFeedbackDialogOpen(true)}
            className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white hover:duration-300"
            variant={"outline"}
          >
            View Feedback
          </Button>
        </div>
        <Dialog
          open={isFeedbackDialogOpen}
          onOpenChange={setIsFeedbackDialogOpen}
        >
          <DialogContent className="max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Level Feedback</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              {levelWithMetaData.strengths.length !== 0 && (
                <div className="flex flex-col  bg-[#f1ffec] px-8 py-4 rounded-lg border-2 border-green-200">
                  <ul className="flex flex-col gap-2 list-disc">
                    <div className="text-green-500 font-semibold">
                      Strengths
                    </div>
                    {levelWithMetaData.strengths.map(
                      (strength: string, index: number) => {
                        return <li key={index}>{strength}</li>;
                      }
                    )}
                  </ul>
                </div>
              )}
              {levelWithMetaData.weaknesses.length !== 0 && (
                <div className="flex flex-col bg-[#feeeee] px-8 py-4 rounded-lg border-2 border-red-200">
                  <div className="text-red-500 font-semibold">Weaknesses</div>
                  <ul className="flex flex-col gap-2 list-disc">
                    {levelWithMetaData.weaknesses.map(
                      (weakness: string, index: number) => {
                        return <li key={index}>{weakness}</li>;
                      }
                    )}
                  </ul>
                </div>
              )}
              {levelWithMetaData.recommendations.length !== 0 && (
                <div className="flex flex-col bg-[#ecfbff] px-8 py-4 rounded-lg border-2 border-blue-200">
                  <div className="text-blue-500 font-semibold">
                    Recommendations
                  </div>
                  <ul className="flex flex-col gap-2 list-disc">
                    {levelWithMetaData.recommendations.map(
                      (recommendation: string, index: number) => {
                        return <li key={index}>{recommendation}</li>;
                      }
                    )}
                  </ul>
                </div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      
      </div>
    </>
  );
};

export default LevelWithMetaDataCard;
