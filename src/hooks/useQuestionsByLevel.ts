import { API_URL } from "@/App";
import  { QuestionType } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"

export const useQuestionsByLevel = (levelId:string) => {
    const [questions,setQuestions] = useState<QuestionType[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {

        const fetchQuestionsByLevel = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get<{success:boolean;questions:QuestionType[]}>(`${API_URL}/question/${levelId}`,{
                    withCredentials:true,
                });   
                console.log(response);
                setQuestions(response.data.questions);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchQuestionsByLevel();
    
    },[levelId])

    return {questions,setQuestions,isLoading};

}