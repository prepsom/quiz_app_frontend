import { API_URL } from "@/App";
import { UserType } from "@/types"
import axios from "axios";
import { useEffect, useState } from "react"
import { useToast } from "./use-toast";





export const useStudentsByGrade = (gradeId:string,page:number,limit:number,filterByNameOrEmail?:string,sortByTotalPoints?:"asc" | "desc") => {

    const [students,setStudents] = useState<UserType[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [totalPages,setTotalPages] = useState<number>(1);
    const {toast} = useToast();

    useEffect(() => {


        const queryParams = new URLSearchParams();
        queryParams.set("page",page.toString());
        queryParams.set("limit",limit.toString());

        if(filterByNameOrEmail) {
            queryParams.set("filterByNameOrEmail",filterByNameOrEmail);
        }

        if(sortByTotalPoints) {
            queryParams.set("sortByTotalPoints",sortByTotalPoints);
        }

        const abortController = new AbortController();

        const fetchStudentsInGrade = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get<{success:boolean;students:UserType[];totalPages:number;page:number;limit:number}>(`${API_URL}/grade/${gradeId}/students?${queryParams.toString()}`,{
                    signal:abortController.signal,
                    withCredentials:true,
                });
                setStudents(response.data.students);
                setTotalPages(response.data.totalPages);
            } catch (error:any) {
                if(error.name!=="CanceledError") {
                    toast({
                        title:"Error",
                        description:"Failed to fetch students",
                        variant:"destructive",
                    });
                }
            } finally {
                setIsLoading(false);
            }
        }

        fetchStudentsInGrade();

        return () => abortController.abort();

    } ,[gradeId,page,limit,filterByNameOrEmail,sortByTotalPoints]);

    return {students,setStudents,isLoading,totalPages};
}
