import { API_URL } from "@/App";
import { SubjectType } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"



export const useSubjectsByGrade = (gradeId:string) => {

    const [subjects,setSubjects] = useState<SubjectType[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchSubjectsByGrade = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get<{success:boolean;subjects:SubjectType[]}>(`${API_URL}/subject/subjects/${gradeId}`,{
                    withCredentials:true,
                });
                console.log(response);
                setSubjects(response.data.subjects);
            } catch (error) {
                 console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSubjectsByGrade();
    },[gradeId]);

    return {subjects,isLoading};
}