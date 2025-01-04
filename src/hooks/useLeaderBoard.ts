import { API_URL } from "@/App";
import { LeaderBoardUsersType } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"

export const useLeaderBoard = () => {
    const [usersWithTotalPoints,setUsersWithTotalPoints] = useState<LeaderBoardUsersType[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const [error,setError] = useState<string>("");

    useEffect(() => {
        
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get<{success:boolean;usersWithTotalPoints:LeaderBoardUsersType[]}>(`${API_URL}/user/leaderboard`,{
                    withCredentials:true,
                });
                console.log(response);
                setUsersWithTotalPoints(response.data.usersWithTotalPoints);
            } catch (error) {
                console.log(error);
                setError("Error while getting leaderboard rankings");
            } finally {
                setIsLoading(false);
            }
        }
        fetchLeaderboard();
    },[])
    

    return {usersWithTotalPoints,isLoading,error};
}