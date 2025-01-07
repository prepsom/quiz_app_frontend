import { API_URL } from "@/App";
import { LevelType } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export const useLevelsBySubject = (subjectId: string) => {
  const [levels, setLevels] = useState<LevelType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLevelsBySubject = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<{
          success: boolean;
          levels: LevelType[];
        }>(`${API_URL}/level/levels/${subjectId}`, {
          withCredentials: true,
        });
        setLevels(response.data.levels);
      } catch (error) {
        toast({
          title: "Error in fetching levels by subject",
          description: "check your network connection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLevelsBySubject();
  }, [subjectId]);

  return { levels, isLoading };
};
