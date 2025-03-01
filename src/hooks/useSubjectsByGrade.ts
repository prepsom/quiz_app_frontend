import { API_URL } from "@/App";
import { SubjectType } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export const useSubjectsByGrade = (gradeId: string) => {
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubjectsByGrade = async () => {
      if (gradeId === undefined) return;
      try {
        setIsLoading(true);
        const response = await axios.get<{
          success: boolean;
          subjects: SubjectType[];
        }>(`${API_URL}/subject/subjects/${gradeId}`, {
          withCredentials: true,
        });
        setSubjects(response.data.subjects);
      } catch (error) {
        toast({
          title: "Error fetching subjects",
          description: "check your network connection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubjectsByGrade();
  }, [gradeId]);

  return { subjects, isLoading, setSubjects };
};
