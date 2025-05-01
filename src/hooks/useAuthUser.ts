import { API_URL } from "@/App";
import { UserType } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export const useAuthUser = () => {
  const { toast } = useToast();
  const [loggedInUser, setLoggedInUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAuthenticatedUser = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/auth/user`, {
          withCredentials: true,
        });
        setLoggedInUser(response.data.user);
      } catch (error: any) {
        toast({
          title: "Login to get started",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuthenticatedUser();
  }, []);

  return { loggedInUser, setLoggedInUser, isLoading };
};
