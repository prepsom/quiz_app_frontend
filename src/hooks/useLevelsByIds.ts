import { API_URL } from "@/App";
import { LevelType } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export const useLevelsByIds = (levelIds: string[]) => {
  const [levels, setLevels] = useState<LevelType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (levelIds.length === 0) return;

    const fetchLevelsByIds = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post<{
          success: boolean;
          levels: LevelType[];
        }>(
          `${API_URL}/level/levels`,
          {
            levelIds: levelIds,
          },
          {
            withCredentials: true,
          }
        );

        setLevels(response.data.levels);
      } catch (error) {
        toast({
          title: "failed to fetch levels",
          description: "Please check your network connection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchLevelsByIds();
  }, [levelIds]);

  return {
    isLoading,
    levels,
  };
};
