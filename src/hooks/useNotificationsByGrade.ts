import { Notification } from "@/types"
import { useEffect, useState } from "react"
import { useToast } from "./use-toast";
import axios from "axios";
import { API_URL } from "@/App";

export const useNotificationsByGrade = (gradeId:string,page:number,limit:number) => {
    const [notifications,setNotifications] = useState<Notification[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [totalPages,setTotalPages] = useState<number>(0);
    const {toast} = useToast();

    useEffect(() => {

        const queryParams = new URLSearchParams();
        queryParams.set("page",page.toString());
        queryParams.set("limit",limit.toString());


        const fetchNotificationsByGrade = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get<{success:boolean;notifications:Notification[];totalPages:number}>(`${API_URL}/notification/notifications/${gradeId}?${queryParams.toString()}`,{
                    withCredentials:true,
                });
                setNotifications(response.data.notifications);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                toast({
                    title:"Error fetching notifications",
                    description:"please check your network connection",
                    variant:"destructive"
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchNotificationsByGrade();
    } , [gradeId,page,limit]);

    return {notifications,isLoading,totalPages,setNotifications};
}