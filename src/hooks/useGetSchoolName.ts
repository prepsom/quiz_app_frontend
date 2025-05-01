import { API_URL } from "@/App";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export const useGetSchoolNameByGrade = (gradeId: string | undefined) => {
  const [schoolName, setSchoolName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSchoolName = async () => {
      if (gradeId === undefined) return;
      try {
        setIsLoading(true);
        const response = await axios.get<{
          success: boolean;
          schoolName: string;
        }>(`${API_URL}/school/school-name/${gradeId}`);
        setSchoolName(response.data.schoolName);
      } catch (error) {
        console.log(error);
        toast({
          title: "Failed to fetch school name",
          description: "Please check your network connection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchoolName();
  }, [gradeId]);

  return {
    schoolName,
    isLoading,
  };
};
