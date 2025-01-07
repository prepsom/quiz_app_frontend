import { API_URL } from "@/App";
import { QuestionType } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useAnsweredQuestionsInLevel = (levelId: string) => {
  const { toast } = useToast();
  const [answeredQuestions, setAnsweredQuestions] = useState<QuestionType[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAnsweredQuestionsInLevel = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<{
          success: boolean;
          answeredQuestions: QuestionType[];
        }>(`${API_URL}/question/answered/${levelId}`, {
          withCredentials: true,
        });
        setAnsweredQuestions(response.data.answeredQuestions);
      } catch (error) {
        toast({
          title: "unable to fetch answered questions",
          description: "check your network connection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnsweredQuestionsInLevel();
  }, [levelId]);

  return { answeredQuestions, isLoading };
};
