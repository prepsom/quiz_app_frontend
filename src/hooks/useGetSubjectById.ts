import { API_URL } from "@/App";
import { SubjectType } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "./use-toast";

export const useGetSubjectById = (subjectId: string | null) => {
  const [subject, setSubject] = useState<SubjectType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubjectById = async () => {
      if (subjectId === "" || subjectId === null) return;
      try {
        const response = await axios.get<{
          success: boolean;
          subject: SubjectType;
        }>(`${API_URL}/subject/${subjectId}`);
        setSubject(response.data.subject);
      } catch (error) {
        toast({
          title: "Error in fetching subject",
          description: "check your network connection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjectById();
  }, [subjectId]);

  return { subject, isLoading };
};
