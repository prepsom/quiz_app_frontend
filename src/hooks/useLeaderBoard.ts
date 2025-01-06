import { API_URL } from "@/App";
import { LeaderBoardUsersType } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"

export const useLeaderBoard = (page:number,limit:number) => {
    
    const [usersWithTotalPoints,setUsersWithTotalPoints] = useState<LeaderBoardUsersType[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const [error,setError] = useState<string>("");
    const [noOfPages,setNoOfPages] = useState<number>(1);

    useEffect(() => {
        
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get<{success:boolean;usersWithTotalPoints:LeaderBoardUsersType[];noOfPages:number}>(`${API_URL}/user/leaderboard?page=${page}&limit=${limit}`,{
                    withCredentials:true,
                });
                console.log(response);
                setUsersWithTotalPoints(response.data.usersWithTotalPoints);
                setNoOfPages(response.data.noOfPages);
            } catch (error) {
                console.log(error);
                setError("Error while getting leaderboard rankings");
            } finally {
                setIsLoading(false);
            }
        }
        fetchLeaderboard();
    },[page,limit]);

    return {usersWithTotalPoints,isLoading,error,noOfPages};
}