import { API_URL } from "@/App";
import { QuestionType } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"



export const useAnsweredQuestionsInLevel = (levelId:string) => {

    const [answeredQuestions,setAnsweredQuestions] = useState<QuestionType[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {

        const fetchAnsweredQuestionsInLevel = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get<{success:boolean;answeredQuestions:QuestionType[]}>(`${API_URL}/question/answered/${levelId}`,{
                    withCredentials:true,
                
                });
                console.log(response);
                setAnsweredQuestions(response.data.answeredQuestions);
            
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAnsweredQuestionsInLevel();
    },[levelId])

    return {answeredQuestions,isLoading};
}