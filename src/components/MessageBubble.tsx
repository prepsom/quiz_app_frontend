import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Bot, User } from "lucide-react";
import { ChatMessage } from "@/types";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  // Determine if the message is from the user or the bot
  const isUser = message.messageSenderId !== message.messageReceiverId;

  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      <Avatar
        className={cn("h-10 w-10", isUser ? "bg-blue-500" : "bg-gray-200")}
      >
        <AvatarFallback
          className={
            isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }
        >
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "max-w-[80%] rounded-lg p-3",
          isUser
            ? "bg-blue-500 text-white rounded-tr-none"
            : "bg-white text-gray-800 rounded-tl-none border border-gray-200"
        )}
      >
        <div
          className={cn("prose prose-sm max-w-none", isUser && "prose-invert")}
        >
          <ReactMarkdown>{message.messageText}</ReactMarkdown>
        </div>

        <div
          className={cn(
            "text-xs mt-1",
            isUser ? "text-blue-100" : "text-gray-400"
          )}
        >
          {format(new Date(message.messageCreatedAt), "h:mm a")}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
