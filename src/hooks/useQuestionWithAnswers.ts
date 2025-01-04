import { API_URL } from "@/App";
import { QuestionType } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"




export const useQuestionWithAnswers = (questionId:string) => {
    const [question,setQuestion] = useState<QuestionType | null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(false);


    useEffect(() => {

        const fetchQuestionWithAnswers = async () => {
            if(questionId==="") return;
            console.log('fetching a question with id :- ',questionId);
            try {
                setIsLoading(true);
                const response = await axios.get<{success:boolean;question:QuestionType}>(`${API_URL}/question/answers/${questionId}`,{
                    withCredentials:true,
                });
                console.log(response);
                setQuestion(response.data.question);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchQuestionWithAnswers();
    },[questionId])


    return {question,isLoading};
}