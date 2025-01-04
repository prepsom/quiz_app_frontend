import { API_URL } from "@/App";
import axios from "axios";
import { useEffect, useState } from "react"



export const useUsersTotalPoints = () => {
    const [totalPoints,setTotalPoints] = useState<number>(0);
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const [error,setError] = useState<string>("");

    useEffect(() => {

        const fetchUsersTotalPoints = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/points`,{
                    withCredentials:true,
                });
                console.log(response);
                setTotalPoints(response.data.totalPoints);
            } catch (error) {
                console.log(error);
                setError("failed to fetch user's points");
            } finally {
                setIsLoading(false);
            }
        }
        fetchUsersTotalPoints();
    },[])

    return {totalPoints,isLoading,error};
}

// social mixer event
// 