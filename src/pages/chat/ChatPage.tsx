"use client";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Send, Phone, Video, Info, Smile, MessageCircle } from "lucide-react";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ChatMessage } from "../../components/chat/ChatMessage";
import { ChatUserList } from "../../components/chat/ChatUserList";
import { useAuth } from "../../context/AuthContext";
import { Message, User } from "../../types";
import {
  getMessagesBetweenUsers,
  getConversationsForUser,
  saveMessagesBetweenUsers,
  updateConversationsForUser,
} from "../../data/messages";
import { getUserFromDb } from "../../data/users";
import { useSocket } from "../../context/SocketContext";

export const ChatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState<any | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [chatPartner, setChatPartner] = useState<User | null>(null);
  const [usersMap, setUsersMap] = useState<{ [key: string]: User }>({});
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    getConversationsForUser(currentUser.userId).then(setConversation);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || !userId) return;
    const fetchData = async () => {
      const partner = await getUserFromDb(userId);
      setChatPartner(partner || null);

      const msgs = await getMessagesBetweenUsers(currentUser.userId, userId);
      setMessages(msgs || []);
    };
    fetchData();
  }, [currentUser, userId]);

  useEffect(() => {
    const fetchUsers = async () => {
      const uniqueIds = Array.from(new Set(messages.map((m) => m.senderId)));
      const usersData = await Promise.all(
        uniqueIds.map(async (id) => [id, await getUserFromDb(id)] as [string, User])
      );
      setUsersMap(Object.fromEntries(usersData));
    };
    if (messages.length) fetchUsers();
  }, [messages]);

  useEffect(() => {
    socket?.on("received-message", (msg: Message) => setMessages(prev => [...prev, msg]));
    socket?.on("is-typing", () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    });
    return () => {
      socket?.off("received-message");
      socket?.off("is-typing");
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !userId) return;

    const msg: Message = {
      senderId: currentUser.userId,
      receiverId: userId,
      content: newMessage,
      isRead: false,
    };

    const savedMsg = await saveMessagesBetweenUsers(msg);
    socket?.emit("send-message", savedMsg);
    setMessages(prev => [...prev, savedMsg]);
    setNewMessage("");

    const conv = {
      sender: currentUser.userId,
      receiver: userId,
      lastMessage: savedMsg,
    };
    await updateConversationsForUser(conv);
  };

  if (!currentUser) return null;

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-black text-white">
      {/* Sidebar for chats */}
      <div className="hidden md:block w-1/3 lg:w-1/4 border-r border-purple-800 overflow-y-auto bg-purple-900">
        <ChatUserList conversation={conversation} darkMode />
      </div>

      {/* Main chat */}
      <div className="flex-1 flex flex-col">
        {chatPartner ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-purple-800 bg-purple-950">
              <div className="flex items-center space-x-3">
                <Avatar
                  src={chatPartner.avatarUrl}
                  alt={chatPartner.name}
                  size="md"
                  status={chatPartner.isOnline ? "online" : "offline"}
                />
                <div>
                  <h2 className="text-lg font-medium text-purple-200">{chatPartner.name}</h2>
                  <p className={`text-sm ${isTyping ? "text-green-400" : "text-purple-400"}`}>
                    {isTyping ? "is typing..." : chatPartner.isOnline ? "online" : "Last seen recently"}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-2 hover:bg-purple-800"
                  onClick={() => navigate(`audio-call/${currentUser.userId}&${chatPartner._id}/false`)}
                >
                  <Phone size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-2 hover:bg-purple-800"
                  onClick={() => navigate(`video-call/${currentUser.userId}&${chatPartner._id}/false`)}
                >
                  <Video size={18} />
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full p-2 hover:bg-purple-800">
                  <Info size={18} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-purple-950">
              {messages.length ? (
                messages.map((msg) => (
                  <ChatMessage
                    key={msg._id}
                    message={msg}
                    user={usersMap[msg.senderId]}
                    isCurrentUser={msg.senderId === currentUser.userId}
                    darkMode
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-purple-400">
                  <div className="bg-purple-900 p-4 rounded-full mb-4">
                    <MessageCircle size={32} className="text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-purple-300">No messages yet</h3>
                  <p className="mt-1">Send a message to start chatting</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-purple-800 bg-purple-950">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <Button type="button" variant="ghost" className="rounded-full p-2 hover:bg-purple-800">
                  <Smile size={20} />
                </Button>
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => {
                    socket?.emit("typing", chatPartner._id);
                    setNewMessage(e.target.value);
                  }}
                  fullWidth
                  className="bg-purple-900 border border-purple-700 text-white placeholder-purple-400 focus:ring-purple-500 focus:border-purple-500"
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="rounded-full p-2 w-10 h-10 flex items-center justify-center bg-purple-700 hover:bg-purple-600 text-white"
                >
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-purple-400">
            <div className="bg-purple-900 p-6 rounded-full mb-4">
              <MessageCircle size={48} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-medium text-purple-300">Select a conversation</h2>
            <p className="mt-2">Choose a contact from the list to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};
