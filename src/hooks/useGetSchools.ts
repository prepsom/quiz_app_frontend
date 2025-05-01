import { School } from "@/types";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";
import axios from "axios";
import { API_URL } from "@/App";

export const useGetSchools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<{
          success: boolean;
          schools: School[];
        }>(`${API_URL}/school`);
        setSchools(response.data.schools);
      } catch (error) {
        console.log(error);
        toast({
          title: "Failed to fetch schools",
          description: "Please check your network connection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchools();
  }, []);

  return { schools, isLoading };
};
