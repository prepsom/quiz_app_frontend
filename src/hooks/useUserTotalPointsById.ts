import { useEffect, useState } from "react"
import { useToast } from "./use-toast";
import axios from "axios";
import { API_URL } from "@/App";





export const useUserTotalPointsById = (userId:string) => {
    const [totalPoints,setTotalPoints] = useState<number>(0);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const {toast} = useToast();


    useEffect(() => {
        const fetchUserTotalPoints = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get<{success:boolean,totalPoints:number}>(`${API_URL}/user/${userId}/total-points`,{
                    withCredentials:true,
                });
                setTotalPoints(response.data.totalPoints);
            } catch (error) {
                console.log(error);
                toast({
                    title:"failed to fetch user's total points",
                    description:"check your network connection",
                    variant:"destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }
    
        fetchUserTotalPoints();
    
    } , [userId]);

    return {totalPoints,isLoading};

}