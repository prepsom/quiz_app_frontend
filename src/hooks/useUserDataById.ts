import {UserCompleteLevelType, UserType } from "@/types";
import { useEffect, useState } from "react"
import { useToast } from "./use-toast";
import axios from "axios";
import { API_URL } from "@/App";
/*
{
      success:true,
      userData:user,
      userCompletedLevels:userCompletedLevels,
      totalPoints:userTotalPoints
    }
*/

type ResponseType = {
    success:boolean;
    userData:UserType;
    userCompletedLevels:UserCompleteLevelType[];
    totalPoints:number;
    totalPages:number;
}

type UserDataWithCompletedLevels = UserType & {
    userCompletedLevels:UserCompleteLevelType[];
    totalPoints:number;
}

export const useUserDataById = (userId:string,page:number,limit:number,filterBySubjectId:string | undefined) => {
    const [userData,setUserData] = useState<UserDataWithCompletedLevels | null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [totalPages,setTotalPages] = useState<number>(0);
    const {toast} = useToast();

    useEffect(() => {

        const abortController = new AbortController();
        const queryParams = new URLSearchParams();
        queryParams.set("page",page.toString());
        queryParams.set("limit",limit.toString());

        if(filterBySubjectId) {
            queryParams.set("filterBySubjectId",filterBySubjectId);
        }

        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get<ResponseType>(`${API_URL}/user/${userId}?${queryParams.toString()}`,{
                    withCredentials:true,
                    signal:abortController.signal,
                });
                setUserData({
                    ...response.data.userData,
                    userCompletedLevels:response.data.userCompletedLevels,
                    totalPoints:response.data.totalPoints
                });
                setTotalPages(response.data.totalPages);
            } catch (error:any) {
                if(error.name!=="CanceledError") {
                    toast({
                        title:"Error Fetching User Data",
                        description:"Error fetching user data",
                        variant:"destructive",
                    });
                }
            } finally {
                setIsLoading(false);
            }
        }

        fetchUserData();

        return () => abortController.abort();

    },[userId,page,limit,filterBySubjectId]);

    return {userData,isLoading,totalPages};

}