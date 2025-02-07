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
}

type UserDataWithCompletedLevels = UserType & {
    userCompletedLevels:UserCompleteLevelType[];
    totalPoints:number;
}

export const useUserDataById = (userId:string) => {
    const [userData,setUserData] = useState<UserDataWithCompletedLevels | null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const {toast} = useToast();

    useEffect(() => {

        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get<ResponseType>(`${API_URL}/user/${userId}`,{
                    withCredentials:true,
                });

                console.log(response);
                setUserData({
                    ...response.data.userData,
                    userCompletedLevels:response.data.userCompletedLevels,
                    totalPoints:response.data.totalPoints
                });
            } catch (error) {
                console.log(error);
                toast({
                    title:"Error Fetching User Data",
                    description:"Error fetching user data",
                    variant:"destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchUserData();
    },[userId]);

    return {userData,isLoading};

}