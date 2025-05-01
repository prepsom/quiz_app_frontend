import { API_URL } from "@/App";
import axios from "axios";
import { useEffect, useState } from "react";

export const useUsersTotalPoints = () => {
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsersTotalPoints = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/points`, {
          withCredentials: true,
        });
        setTotalPoints(response.data.totalPoints);
      } catch (error) {
        // toast({
        //   title: "failed to fetch user's points",
        //   description: "check your network connection",
        //   variant: "destructive",
        // });
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsersTotalPoints();
  }, []);

  return { totalPoints, isLoading, setTotalPoints };
};

// social mixer event
//
