import { API_URL } from "@/App";
import { LevelWithMetaData } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export const useCompletedLevelsWithMetaDataInSubject = (subjectId: string) => {
  const [completedLevelsWithMetaData, setCompletedLevelsWithMetaData] =
    useState<LevelWithMetaData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCompletedLevelsWithMetaDataInSubject = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<{
          success: boolean;
          completedLevelsInSubject: LevelWithMetaData[];
        }>(`${API_URL}/level/levels-with-metadata/${subjectId}/completed`, {
          withCredentials: true,
        });
        console.log(response);
        setCompletedLevelsWithMetaData(response.data.completedLevelsInSubject);
      } catch (error) {
        console.log(error);
        toast({
          title: "error fetching completed levels in subject",
          description: "please check your network connection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedLevelsWithMetaDataInSubject();
  }, [subjectId]);

  return { completedLevelsWithMetaData, isLoading };
};
