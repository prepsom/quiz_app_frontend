import { API_URL } from "@/App";
import { QuestionType } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"


interface LevelQuestionsResponse {
    allQuestions: QuestionType[]
    answeredQuestionIds: string[]
    currentPointsInLevel:number;
}

export const useLevelQuestions = (levelId:string) => {

    const [questions,setQuestions] = useState<QuestionType[]>([]);
    const [answeredQuestionsIds,setAnsweredQuestionIds] = useState<Set<string>>(new Set());
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const [error,setError] = useState<string | null>(null);
    const [currentPointsInLevel,setCurrentPointsInLevel] = useState<number>(0);

    useEffect(() => {
        const fetchLevelQuestions = async () => {
            try {

                const response = await axios.get<LevelQuestionsResponse>(`${API_URL}/level/${levelId}/questions`,{
                    withCredentials:true,
                });
                setQuestions(response.data.allQuestions);
                setAnsweredQuestionIds(new Set(response.data.answeredQuestionIds));
                setCurrentPointsInLevel(response.data.currentPointsInLevel);
            } catch (error) {
            
                console.log(error);
                setError("Failed to fetch level questions");
            
            } finally {
                setIsLoading(false);
            }
        }
        fetchLevelQuestions();
    },[levelId])


    const unansweredQuestions = questions.filter((question:QuestionType) => !answeredQuestionsIds.has(question.id));

    const markQuestionAsAnswered = (questionId:string) => {
        setAnsweredQuestionIds(prev => new Set(prev).add(questionId));
    }

    return {
        allQuestions:questions,
        unansweredQuestions,
        isLoading,
        error,
        markQuestionAsAnswered,
        currentPointsInLevel,
    }
}