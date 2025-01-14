import { API_URL } from "@/App";
import { LevelWithMetaData } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export const useCompletedLevelsWithMetaDataInSubject = (
  subjectId: string,
  page: number,
  limit: number
) => {
  const [completedLevelsWithMetaData, setCompletedLevelsWithMetaData] =
    useState<LevelWithMetaData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [noOfPages, setNoOfPages] = useState<number>(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCompletedLevelsWithMetaDataInSubject = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<{
          success: boolean;
          completedLevelsInSubject: LevelWithMetaData[];
          noOfPages: number;
        }>(
          `${API_URL}/level/levels-with-metadata/${subjectId}/completed?page=${page}&limit=${limit}`,
          {
            withCredentials: true,
          }
        );
        console.log(response);
        setCompletedLevelsWithMetaData(response.data.completedLevelsInSubject);
        setNoOfPages(response.data.noOfPages);
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

  return { completedLevelsWithMetaData, isLoading, noOfPages };
};
