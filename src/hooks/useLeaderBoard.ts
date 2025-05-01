import { API_URL } from "@/App";
import { LeaderBoardUsersType } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "./use-toast";

export const useLeaderBoard = (page: number, limit: number) => {
  const [usersWithTotalPoints, setUsersWithTotalPoints] = useState<
    LeaderBoardUsersType[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [noOfPages, setNoOfPages] = useState<number>(1);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get<{
          success: boolean;
          usersWithTotalPoints: LeaderBoardUsersType[];
          noOfPages: number;
        }>(`${API_URL}/user/leaderboard?page=${page}&limit=${limit}`, {
          withCredentials: true,
        });
        setUsersWithTotalPoints(response.data.usersWithTotalPoints);
        setNoOfPages(response.data.noOfPages);
      } catch (error) {
        toast({
          title: "Error while getting leaderboard rankings",
          description: "check your network connection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, [page, limit]);

  return { usersWithTotalPoints, isLoading, noOfPages };
};
