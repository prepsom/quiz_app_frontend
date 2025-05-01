import { API_URL } from "@/App";
import { Grade } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"
import { useToast } from "./use-toast";




export const useGetGradeById = (gradeId:string) => {

    const [grade,setGrade] = useState<Grade | null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const {toast} = useToast();

    useEffect(() => {

        const fetchGradeById = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get<{success:boolean,message:string,grade:Grade}>(`${API_URL}/grade/${gradeId}`);
                setGrade(response.data.grade);
            } catch (error) {
                console.log(error);
                toast({
                    title:"Failed to fetch grade",
                    description:"Please check your network connection",
                    variant:"destructive"
                })
            } finally {
                setIsLoading(false);
            }
        }

        fetchGradeById();

    } ,[gradeId]);

    return {grade,isLoading};

}