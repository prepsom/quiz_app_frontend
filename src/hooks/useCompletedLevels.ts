import { API_URL } from "@/App";
import { LevelWithMetaData } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"
import { useToast } from "./use-toast";




export const useCompletedLevels = () => {
    const [completedLevelsWithMetaData,setCompletedLevelsWithMetaData] = useState<LevelWithMetaData[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const {toast} = useToast();

    useEffect(() => {

        const fetchAllCompletedLevelsByUser = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get<{success:true,completedLevels:LevelWithMetaData[]}>(`${API_URL}/level/levels/completed`,{
                    withCredentials:true,
                });
                console.log(response);
                setCompletedLevelsWithMetaData(response.data.completedLevels);
            } catch (error) {
                console.log(error);
                toast({
                    title:"Failed to get user's completed levels",
                    description:"Please check your network connection",
                    variant:"destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchAllCompletedLevelsByUser();
        
    },[]);

    return {completedLevelsWithMetaData,isLoading};

}