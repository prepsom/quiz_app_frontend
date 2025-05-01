import { School } from "@/types";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";
import axios from "axios";
import { API_URL } from "@/App";

export const useGetSchoolById = (schoolId: string) => {
  const [school, setSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSchoolById = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<{ success: boolean; school: School }>(
          `${API_URL}/school/${schoolId}`
        );
        setSchool(response.data.school);
      } catch (error) {
        console.log(error);
        toast({
          title: "Failed to fetch school",
          description: "Please check your network connection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchoolById();
  }, [schoolId]);

  return { school, isLoading };
};
