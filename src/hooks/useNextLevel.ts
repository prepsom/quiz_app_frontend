import { API_URL } from "@/App";
import { LevelType } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export const useNextLevel = (levelId: string) => {
  const [nextLevel, setNextLevel] = useState<LevelType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNextLevel = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<{
          success: boolean;
          nextLevel: LevelType;
        }>(`${API_URL}/level/next-level/${levelId}`, {
          withCredentials: true,
        });
        setNextLevel(response.data.nextLevel);
      } catch (error) {
        toast({
          title: "failed to get next level",
          description: "check your network connection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchNextLevel();
  }, [levelId]);

  return { nextLevel, isLoading };
};
