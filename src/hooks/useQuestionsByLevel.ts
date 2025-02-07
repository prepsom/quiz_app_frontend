import { API_URL } from "@/App";
import { QuestionDifficulty, QuestionType, QuestionTypeType } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

// // const {
// filterByReady,
// page,
// limit,
// searchByTitle,
// filterByDifficulty,
// filterByQuestionType} = req.query as {filterByReady:"true" | "false";searchByTitle:string;filterByDifficulty:"EASY" | "MEDIUM" | "HARD";filterByQuestionType:"MCQ" | "FILL_IN_BLANK" | "MATCHING";page:string;limit:string};

type Response = {
  success: boolean;
  questions: QuestionType[];
};

type PaginationResponse = {
  success: boolean;
  questions: QuestionType[];
  totalPages: number;
  page: number;
  limit: number;
};

export const useQuestionsByLevel = (
  levelId: string | undefined,
  page?: number,
  limit?: number,
  difficulty?: QuestionDifficulty,
  questionType?: QuestionTypeType,
  searchByTitle?: string,
  questionReady?: boolean
) => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);
  const {toast} = useToast();

  // optional arguments are for pagination and filtering , if no arguments are provided
  // then all questions in level are fetched

  useEffect(() => {
    const queryParams = new URLSearchParams();
    const abortController = new AbortController();

    if (page !== undefined && limit !== undefined) {
      queryParams.set("page", page.toString());
      queryParams.set("limit", limit.toString());
    }

    if (difficulty !== undefined) {
      queryParams.set("filterByDifficulty", difficulty);
    }

    if (questionType !== undefined) {
      queryParams.set("filterByQuestionType", questionType);
    }

    if (searchByTitle !== undefined) {
      queryParams.set("searchByTitle", searchByTitle);
    }

    if (questionReady !== undefined) {
      queryParams.set(
        "filterByReady",
        questionReady === true ? "true" : "false"
      );
    }
    const fetchQuestionsByLevel = async () => {
      if (levelId === undefined) return;
      try {
        setIsLoading(true);
        const response = await axios.get<Response | PaginationResponse>(
          `${API_URL}/question/${levelId}?${queryParams.toString()}`,
          {
            signal:abortController.signal,
            withCredentials: true,
          }
        );
        setQuestions(response.data.questions);
        if ((response.data as PaginationResponse).totalPages) {
          setTotalPages((response.data as PaginationResponse).totalPages);
        }
      } catch (error:any) {
        if(error.name!=="CanceledError") {
          toast({
            title:"Error",
            description:"Failed to fetch questions",
            variant:"destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionsByLevel();

    return () => abortController.abort();

  }, [
    levelId,
    page,
    limit,
    difficulty,
    questionType,
    searchByTitle,
    questionReady,
  ]);

  return { questions, setQuestions, isLoading, totalPages };
};
