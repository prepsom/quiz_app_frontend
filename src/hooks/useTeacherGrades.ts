import { useEffect, useState } from "react"
import { useToast } from "./use-toast";
import axios from "axios";
import { API_URL } from "@/App";




export const useTeacherGrades = () => {
    const [teacherGrades,setTeacherGrades] = useState<{gradeId:string;grade:number;noOfStudents:number}[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const {toast} = useToast();


    useEffect(() => {

        const fetchTeacherGrades = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get<{success:boolean;grades:{gradeId:string;grade:number;noOfStudents:number}[]}>(`${API_URL}/user/teacher/grades`,{
                    withCredentials:true,
                });
                console.log(response);
                setTeacherGrades(response.data.grades);
            } catch (error) {
                console.log(error);
                toast({
                    title:"Error",
                    description:"Error fetching teacher grades",
                    variant:"destructive",
                });
            } finally {
                setIsLoading(false);
            }
        }
        fetchTeacherGrades();
    } , []);


    return {teacherGrades,isLoading};
}