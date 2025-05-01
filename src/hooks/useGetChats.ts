import { API_URL } from "@/App";
import { Chat } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export const useGetChats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllChats = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<{ success: boolean; chats: Chat[] }>(
          `${API_URL}/chat/chats`,
          {
            withCredentials: true,
          }
        );
        setChats(response.data.chats);
      } catch (error) {
        toast({
          title: "Failed to fetch all chats",
          description: "Please check your network connection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllChats();
  }, []);

  return {
    chats,
    isLoading,
  };
};
