import { API_URL } from "@/App";
import { LevelType } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"



export const useLevelsBySubject = (subjectId:string) => {
    const [levels,setLevels] = useState<LevelType[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);


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
            
                console.log(error);
            
            } finally {
                setIsLoading(false);
            }
        }

        fetchLevelsBySubject();
        
    },[subjectId])

    return {levels,isLoading};
}