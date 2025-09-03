import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Send, Phone, Video, Info, Smile } from "lucide-react";
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
import { MessageCircle } from "lucide-react";
import { getUserFromDb } from "../../data/users";
import { io } from "socket.io-client";

export const ChatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [checkStatus, setCheckStatus] = useState(false);
  const [conversation, setConversation] = useState<any | null>();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [chatPartner, setChatPartner] = useState<User | null>(null);
  const [users, setUsers] = useState<[string, User][]>([]);
  const socket = useRef<any>();

  useEffect(() => {
    const fetchConversation = async () => {
      // Load conversations
      const conv = await getConversationsForUser(currentUser?.userId,userId);
      if (conv) setConversation(conv);
    };
    fetchConversation();
  }, [userId, currentUser?.userId, messages]);

  useEffect(() => {
    if (!currentUser?.userId || !userId) return; // guard clause
    const fetchUserData = async () => {
      try {
        // Load partner Data
        const partner = await getUserFromDb(userId);
        setChatPartner(partner || null);

        // Load messages
        const messages = await getMessagesBetweenUsers(
          currentUser.userId,
          userId
        );
        setMessages(messages.length > 0 ? messages : []);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [currentUser?.userId, userId]);

  useEffect(() => {
    const fetchUsers = async () => {
      const uniqueIds = Array.from(new Set(messages.map((m) => m.senderId)));
      const usersData = await Promise.all(
        uniqueIds.map(async (id) => {
          const user = await getUserFromDb(id);
          return [id, user] as [string, User];
        })
      );

      setUsers(Object.fromEntries(usersData));
    };

    if (messages.length > 0) {
      fetchUsers();
    }
  }, [messages]);

  // connect socket.io client
  useEffect(() => {
    socket.current = io("http://localhost:5000", {
      withCredentials: true,
    });

    const handleConnect = () => {
      socket.current.emit("join", currentUser?.userId);
    };

    //  connect user
    socket.current.on("connect", handleConnect);

    // when user receive message
    socket.current.on("received-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    //  when user get typing
    socket.current.on("is-typing", () => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    });

    //   when user got hi
    socket.current.on("hi", () => {
      alert("hi");
    });
    
    //  when user offline or status changed
    socket.current.on("check-user-status",()=>{
      setCheckStatus(!checkStatus);
    })
    return () => {
      if (socket.current) {
        socket.current.off("connect", handleConnect);
        socket.current.off("hi");
        socket.current.disconnect();
      }
    };
  }, [currentUser?.userId]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //  Hanlde send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !currentUser || !userId) return;

    const message = {
      senderId: currentUser.userId,
      receiverId: userId,
      content: newMessage,
      isRead: false,
    };

    const msg = await saveMessagesBetweenUsers(message);
    socket.current.emit("send-message", msg);
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");

    // Update conversation
    try {
      const con = {
        sender: currentUser?.userId,
        receiver: userId,
        lastMessage: { ...msg },
      };
      const updatedConv = await updateConversationsForUser(con);
      if (updatedConv) {
        setConversation(updatedConv);
      }
    } catch (err) {
      console.error("Failed to update conversation", err);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white border border-gray-200 rounded-lg overflow-hidden animate-fade-in">
      {/* Conversations sidebar */}
      <div className="hidden md:block w-1/3 lg:w-1/4 border-r border-gray-200">
        <ChatUserList conversation={conversation || null} />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        {chatPartner ? (
          <>
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
              <div className="flex items-center">
                <Avatar
                  src={chatPartner.avatarUrl}
                  alt={chatPartner.name}
                  size="md"
                  status={chatPartner.isOnline ? "online" : "offline"}
                  className="mr-3"
                />

                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {chatPartner.name}
                  </h2>
                  <p
                    className={`text-sm ${
                      isTyping || chatPartner.isOnline? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    {isTyping
                      ? "is typing"
                      : chatPartner.isOnline
                      ? "online"
                      : "Last seen recently"}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-2"
                  aria-label="Voice call"
                >
                  <Phone size={18} />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-2"
                  aria-label="Video call"
                >
                  <Video size={18} />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-2"
                  aria-label="Info"
                >
                  <Info size={18} />
                </Button>
              </div>
            </div>

            {/* Messages container */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <ChatMessage
                      key={msg._id}
                      message={msg}
                      user={users[msg.senderId]}
                      isCurrentUser={msg.senderId === currentUser?.userId}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <MessageCircle size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">
                    No messages yet
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Send a message to start the conversation
                  </p>
                </div>
              )}
            </div>

            {/* Message input */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-2"
                  aria-label="Add emoji"
                >
                  <Smile size={20} />
                </Button>

                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => {
                    e.preventDefault();
                    socket.current.emit("typing", chatPartner._id);
                    setNewMessage(e.target.value);
                  }}
                  fullWidth
                  className="flex-1"
                />

                <Button
                  type="submit"
                  size="sm"
                  disabled={!newMessage.trim()}
                  className="rounded-full p-2 w-10 h-10 flex items-center justify-center"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <MessageCircle size={48} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-700">
              Select a conversation
            </h2>
            <p className="text-gray-500 mt-2 text-center">
              Choose a contact from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
