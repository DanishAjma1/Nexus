import React, { useEffect, useState } from "react"; 
import { useAuth } from "../../context/AuthContext";
import { getConversationsForUser } from "../../data/messages";
import { ChatUserList } from "../../components/chat/ChatUserList";
import { MessageCircle } from "lucide-react";
import { ChatConversation } from "../../types";

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [conversation, setConversation] = useState<ChatConversation | null>();

  if (!user) return null;

  useEffect(() => {
    const fetchConversation = async () => {
      const conv = await getConversationsForUser(user?.userId);
      if (conv) {
        setConversation(conv);
      }
    };

    fetchConversation();
  }, [user?.userId]);

  return (
    <div className="h-[calc(100vh-8rem)] bg-purple-900 rounded-lg shadow-lg border border-purple-800 overflow-hidden animate-fade-in flex justify-center">
      {conversation ? (
        <div className="hidden md:block w-3/4 border-x border-purple-800">
          <ChatUserList conversation={conversation || null} />
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center p-8">
          <div className="bg-purple-700 p-6 rounded-full mb-4">
            <MessageCircle size={32} className="text-purple-200" />
          </div>
          <h2 className="text-xl font-medium text-purple-100">No messages yet</h2>
          <p className="text-purple-300 text-center mt-2">
            Start connecting with entrepreneurs and investors to begin a conversation
          </p>
        </div>
      )}
    </div>
  );
};
