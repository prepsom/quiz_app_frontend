import { API_URL } from "@/App";
import type { ChatMessage } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "./use-toast";

export const useChatMessages = (
  chatId: string | undefined,
  page: number,
  limit: number,
  refetchTrigger: number
) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    // Only fetch if we have a chatId
    if (!chatId) {
      setChatMessages([]);
      setTotalPages(0);
      return;
    }

    const queryParams = new URLSearchParams();
    queryParams.set("page", page.toString());
    queryParams.set("limit", limit.toString());

    const fetchChatMessages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<{
          success: boolean;
          messages: ChatMessage[];
          totalPages: number;
        }>(`${API_URL}/chat/${chatId}/messages?${queryParams.toString()}`, {
          withCredentials: true,
        });

        // If it's the first page, replace all messages
        // Otherwise, append new messages to the beginning (older messages)
        if (page === 1) {
          setChatMessages(response.data.messages);
        } else {
          setChatMessages((prev) => [...response.data.messages, ...prev]);
        }

        setTotalPages(response.data.totalPages);
      } catch (error) {
        toast({
          title: "Failed to fetch chat messages",
          description: "Please check your network connection",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatMessages();
  }, [chatId, page, limit, toast, refetchTrigger]);

  return { chatMessages, isLoading, totalPages, setChatMessages };
};
