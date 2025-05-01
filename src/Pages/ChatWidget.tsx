"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useGetChats } from "@/hooks/useGetChats";
import { useChatMessages } from "@/hooks/useChatMessages";
import type { Chat } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Send,
  PlusCircle,
  MessageCircle,
  Bot,
  Menu,
  X,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { API_URL } from "@/App";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MessageBubble from "@/components/MessageBubble";
import { useLocation } from "react-router-dom";

const ChatWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { chats, isLoading: isChatsLoading } = useGetChats();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isAtBottom, setIsAtBottom] = useState(true);

  const {
    chatMessages,
    isLoading: isMessagesLoading,
    totalPages,
  } = useChatMessages(selectedChat?.id, page, limit, refetchTrigger);

  // Scroll to bottom when messages change if user was at bottom or a new message was sent
  useEffect(() => {
    if ((shouldScrollToBottom || isAtBottom) && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShouldScrollToBottom(false);
    }
  }, [shouldScrollToBottom, isAtBottom, chatMessages]);

  // Focus input when chat changes or widget opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setShouldScrollToBottom(true);
    }
  }, [selectedChat, isOpen]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || sendingMessage) return;

    try {
      setSendingMessage(true);

      const response = await axios.post(
        `${API_URL}/chat/message`,
        {
          messageText: messageText.trim(),
          chatId: selectedChat?.id,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        if (!selectedChat && response.data.chat) {
          setSelectedChat(response.data.chat);
        }

        setMessageText("");
        setRefetchTrigger((prev) => prev + 1);
        setShouldScrollToBottom(true);
      }
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const handleNewChat = () => {
    setSelectedChat(null);
    setPage(1);
    inputRef.current?.focus();
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setPage(1);
  };

  const loadMoreMessages = () => {
    if (page < totalPages) {
      const scrollContainer = messagesContainerRef.current;
      const scrollPosition = scrollContainer?.scrollTop || 0;
      const scrollHeight = scrollContainer?.scrollHeight || 0;

      setPage((prev) => prev + 1);

      setTimeout(() => {
        if (scrollContainer) {
          const newScrollHeight = scrollContainer.scrollHeight;
          const heightDifference = newScrollHeight - scrollHeight;
          scrollContainer.scrollTop = scrollPosition + heightDifference;
        }
      }, 100);
    }
  };

  // Track if user is at bottom of messages
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;
      setIsAtBottom(isNearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle chat widget
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset expanded state when opening
      setIsExpanded(false);
    }
  };

  // Toggle expanded state
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  if (location.pathname.startsWith("/level/")) {
    return <></>;
  }
  return (
    <>
      {/* Chat toggle button - always visible */}
      <button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-20 right-4 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300",
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chat widget */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-40 bg-white rounded-lg shadow-xl transition-all duration-300 overflow-hidden",
            isExpanded
              ? "inset-4 md:inset-10"
              : "right-4 bottom-36 w-[calc(100%-2rem)] max-w-md h-[60vh] md:h-[70vh]"
          )}
        >
          {/* Widget header */}
          <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200">
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-500">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[80%] max-w-xs">
                  <SheetHeader>
                    <SheetTitle>Chats</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <Button
                      onClick={handleNewChat}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-4"
                    >
                      <PlusCircle className="h-5 w-5 mr-2" />
                      New Chat
                    </Button>

                    {isChatsLoading ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-10 w-full" />
                        ))}
                      </div>
                    ) : chats.length === 0 ? (
                      <div className="text-center text-gray-500 p-4">
                        No chats yet. Start a new conversation!
                      </div>
                    ) : (
                      <ul className="space-y-1">
                        {chats.map((chat) => (
                          <li key={chat.id}>
                            <Button
                              variant="ghost"
                              onClick={() => handleSelectChat(chat)}
                              className={cn(
                                "w-full justify-start",
                                selectedChat?.id === chat.id
                                  ? "bg-blue-100 text-blue-800"
                                  : "hover:bg-gray-100 text-gray-700"
                              )}
                            >
                              <MessageCircle
                                className={cn(
                                  "h-5 w-5 mr-2",
                                  selectedChat?.id === chat.id
                                    ? "text-blue-600"
                                    : "text-gray-500"
                                )}
                              />
                              <span className="truncate">
                                {chat.title || "Untitled Chat"}
                              </span>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <h1 className="font-semibold text-lg ml-2">
                {selectedChat ? selectedChat.title : "AI Assistant"}
              </h1>
            </div>

            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNewChat}
                className="text-blue-500 mr-1"
              >
                <PlusCircle className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleExpand}
                className="text-gray-500"
              >
                {isExpanded ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Chat content */}
          <div className="flex flex-col h-[calc(100%-8rem)]">
            {/* Messages area */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 bg-gray-50"
            >
              {isMessagesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !selectedChat && chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <Bot className="h-16 w-16 text-blue-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    How can I help you?
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Ask me any questions about your studies, homework, or
                    concepts you're learning.
                  </p>
                </div>
              ) : (
                <>
                  {totalPages > 1 && page < totalPages && (
                    <div className="flex justify-center mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadMoreMessages}
                        disabled={isMessagesLoading}
                      >
                        Load more messages
                      </Button>
                    </div>
                  )}
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </>
              )}
            </div>

            {/* Input area */}
            <div className="p-3 border-t border-gray-200 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <Input
                  ref={inputRef}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isMessagesLoading || sendingMessage}
                />
                <Button
                  type="submit"
                  disabled={
                    isMessagesLoading || sendingMessage || !messageText.trim()
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                  size="icon"
                >
                  {sendingMessage ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
