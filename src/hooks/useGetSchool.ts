import { School } from "@/types";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";
import axios from "axios";
import { API_URL } from "@/App";

export const useGetSchool = (schoolName: string | undefined) => {
  const [school, setSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSchoolBySchoolName = async () => {
      if (schoolName === undefined) return;
      try {
        setIsLoading(true);
        const response = await axios.get<{ success: boolean; school: School }>(
          `${API_URL}/school/${schoolName}`
        );
        console.log(response);
        setSchool(response.data.school);
      } catch (error) {
        console.log(error);
        toast({
          title: "invalid school name",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchoolBySchoolName();
  }, [schoolName]);

  return { school, isLoading };
};
