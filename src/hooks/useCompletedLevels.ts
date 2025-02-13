import { API_URL } from "@/App";
import { LevelWithMetaData } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export const useCompletedLevels = (page: number, limit: number,filterBySubjectId:string | undefined) => {
  const [completedLevelsWithMetaData, setCompletedLevelsWithMetaData] =
    useState<LevelWithMetaData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noOfPages, setNoOfPages] = useState<number>(1);
  const { toast } = useToast();

  useEffect(() => {

    const abortController = new AbortController();

    const queryParams = new URLSearchParams();
    queryParams.set("page",page.toString());
    queryParams.set("limit",limit.toString());
    if(filterBySubjectId!==undefined) {
      queryParams.set("filterBySubjectId",filterBySubjectId);
    }


    const fetchAllCompletedLevelsByUser = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<{
          success: true;
          completedLevels: LevelWithMetaData[];
          noOfPages: number;
        }>(`${API_URL}/level/levels/completed?${queryParams.toString()}`, {
          withCredentials: true,
          signal:abortController.signal,
        });
        setCompletedLevelsWithMetaData(response.data.completedLevels);
        setNoOfPages(response.data.noOfPages);
      } catch (error:any) {
        if(error.name!=="CanceledError") {
          toast({
            title: "Failed to get user's completed levels",
            description: "Please check your network connection",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCompletedLevelsByUser();

    return () => abortController.abort();

  }, [page, limit,filterBySubjectId]);

  return { completedLevelsWithMetaData, isLoading, noOfPages };
};
