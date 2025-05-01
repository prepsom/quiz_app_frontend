import { API_URL } from "@/App";
import { QuestionType } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export const useQuestionWithAnswers = (questionId: string) => {
  const [question, setQuestion] = useState<QuestionType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuestionWithAnswers = async () => {
      if (questionId === "") return;
      try {
        setIsLoading(true);
        const response = await axios.get<{
          success: boolean;
          question: QuestionType;
        }>(`${API_URL}/question/answers/${questionId}`, {
          withCredentials: true,
        });
        setQuestion(response.data.question);
      } catch (error) {
        toast({
          title: "Error fetching question with answers",
          description: "check your network connection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestionWithAnswers();
  }, [questionId]);

  return { question, isLoading };
};
