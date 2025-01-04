import { API_URL } from "@/App";
import { LevelType } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"



export const useGetLevelById = (levelId:string) => {
    const [level,setLevel] = useState<LevelType | null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const [error,setError] = useState<string>("");

    useEffect(() =>  {
        const fetchLevelById = async () => {
            try {
                const response = await axios.get<{success:boolean;level:LevelType}>(`${API_URL}/level/${levelId}`);
                console.log(response);
                setLevel(response.data.level);
            } catch (error) {
                setError("Error fetching level by id");
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLevelById();
    },[levelId]);

    return {level,isLoading,error};
}