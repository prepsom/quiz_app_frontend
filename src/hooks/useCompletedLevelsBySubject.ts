import { API_URL } from "@/App";
import { LevelType } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"



export const useCompletedLevelsBySubject = (subjectId:string) => {

    const [completedLevels,setCompletedLevels] = useState<LevelType[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const [error,setError] = useState<string>("");


    useEffect(() => {
        const fetchCompletedLevelsBySubject = async () => {
            try {
                const response = await axios.get<{success:boolean;completedLevels:LevelType[]}>(`${API_URL}/level/levels/${subjectId}/completed`,{
                    withCredentials:true,
                });
                setCompletedLevels(response.data.completedLevels);
            } catch (error) {
                console.log(error);
                setError("error while fetching completed levels in subject");
            } finally {
                setIsLoading(false);
            }
        }

        fetchCompletedLevelsBySubject();
    },[subjectId])

    return {completedLevels,isLoading,error};

}