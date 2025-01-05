import { API_URL } from "@/App";
import { LevelType } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"



export const useLevelsBySubject = (subjectId:string) => {
    const [levels,setLevels] = useState<LevelType[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [error,setError] = useState<string>("");

    useEffect(() => {

        const fetchLevelsBySubject = async () => {
            try {
                setIsLoading(true);
                
                const response = await axios.get<{success:boolean;levels:LevelType[]}>(`${API_URL}/level/levels/${subjectId}`,{
                    withCredentials:true,
                });
                
                console.log(response);
                setLevels(response.data.levels);
            } catch (error) {
                setError("Error in fetching levels by subject");
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLevelsBySubject();
        
    },[subjectId])

    return {levels,isLoading,error};
}