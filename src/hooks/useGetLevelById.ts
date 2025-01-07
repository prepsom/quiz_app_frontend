import { API_URL } from "@/App";
import { LevelType } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"
import { useToast } from "./use-toast";



export const useGetLevelById = (levelId:string) => {
    const [level,setLevel] = useState<LevelType | null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const {toast} = useToast();

    useEffect(() =>  {
        const fetchLevelById = async () => {
            try {
                const response = await axios.get<{success:boolean;level:LevelType}>(`${API_URL}/level/${levelId}`);
                setLevel(response.data.level);
            } catch (error) {
                toast({
                    "title":"Error fetching level",
                    "description":"check your network connection",
                    "variant":"destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchLevelById();
    },[levelId]);

    return {level,isLoading};
}