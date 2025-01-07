import { API_URL } from "@/App";
import { LevelType } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export const useCompletedLevelsBySubject = (subjectId: string) => {
  const { toast } = useToast();
  const [completedLevels, setCompletedLevels] = useState<LevelType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCompletedLevelsBySubject = async () => {
      try {
        const response = await axios.get<{
          success: boolean;
          completedLevels: LevelType[];
        }>(`${API_URL}/level/levels/${subjectId}/completed`, {
          withCredentials: true,
        });
        setCompletedLevels(response.data.completedLevels);
      } catch (error) {
        toast({
          title: "error while fetching completed levels in subject",
          description: "check your network connection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedLevelsBySubject();
  }, [subjectId]);

  return { completedLevels, isLoading };
};
