import { API_URL } from "@/App";
import { SubjectType } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"



export const useGetSubjectById = (subjectId:string | null) => {

    const [subject,setSubject] = useState<SubjectType | null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const [error,setError] = useState<string>("");

    useEffect(() => {
        
        const fetchSubjectById = async () => {
            if(subjectId==="" || subjectId===null) return;
            try {
                const response = await axios.get<{success:boolean;subject:SubjectType}>(`${API_URL}/subject/${subjectId}`);
                console.log(response);
                setSubject(response.data.subject);
            } catch (error) {
                console.log(error);
                setError("Error in fetching subject by id");
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchSubjectById();
    },[subjectId]);

    return {subject,isLoading,error};

}