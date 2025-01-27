import { API_URL } from "@/App";
import { QuestionType } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, useToast } from "./use-toast";

export const useQuestionsByLevel = (levelId: string | undefined) => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {} = useToast();

  useEffect(() => {
    const fetchQuestionsByLevel = async () => {
      if (levelId === undefined) return;
      try {
        setIsLoading(true);
        const response = await axios.get<{
          success: boolean;
          questions: QuestionType[];
        }>(`${API_URL}/question/${levelId}`, {
          withCredentials: true,
        });
        setQuestions(response.data.questions);
      } catch (error) {
        toast({
          title: "Error in fetching questions by level",
          description: "check your network connection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionsByLevel();
  }, [levelId]);

  return { questions, setQuestions, isLoading };
};
