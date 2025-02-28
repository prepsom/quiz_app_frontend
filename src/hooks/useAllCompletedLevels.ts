import { API_URL } from "@/App";
import { LevelType } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export const useAllCompletedLevels = () => {
  const [completedLevels, setCompletedLevels] = useState<LevelType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllCompletedLevelsByUser = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<{
          success: boolean;
          completedLevels: LevelType[];
        }>(`${API_URL}/level/levels/completed-all`, {
          withCredentials: true,
        });
        setCompletedLevels(response.data.completedLevels);
      } catch (error) {
        toast({
          title: "failed to fetch all completed levels",
          description: "Please check your network connection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCompletedLevelsByUser();
  }, []);

  return {
    completedLevels,
    isLoading,
  };
};
