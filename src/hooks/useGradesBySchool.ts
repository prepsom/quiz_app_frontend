import { Grade } from "@/types";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";
import axios from "axios";
import { API_URL } from "@/App";

export const useGradesBySchool = (schoolId: string) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGradesBySchool = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<{ success: boolean; grades: Grade[] }>(
          `${API_URL}/school/${schoolId}/grades`
        );
        setGrades(response.data.grades);
      } catch (error) {
        toast({
          title: "Failed to fetch grades in school",
          description: "Please check your network connection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGradesBySchool();
  }, [schoolId]);

  return { grades, isLoading };
};
