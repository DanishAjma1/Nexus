import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Send, Phone, Video, Info, Smile, Menu, X, MessageSquare, ChevronLeft } from "lucide-react";
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
import { useSocket } from "../../context/SocketContext";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { socket } = useSocket();

  const navigate = useNavigate();

  // Load conversations
  useEffect(() => {
    const fetchConversation = async () => {
      const conv = await getConversationsForUser(currentUser?.userId);
      if (conv) setConversation(conv);
    };
    fetchConversation();
  }, [userId, currentUser?.userId, messages]);

  //  Fetch Partner Data, messages
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

  //  Set Last messages for each conversation
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

  // Connect socket.io client
  useEffect(() => {
    // when user receive message
    socket?.on("received-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    //  when user get typing
    socket?.on("is-typing", () => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    });

    //  when user offline or status changed
    socket?.on("check-user-status", () => {
      setCheckStatus(!checkStatus);
    });
    return () => {
      socket?.off("send-messsage");
      socket?.off("received-messsage");
      socket?.off("accept-call");
      socket?.off("reject-call");
    };
  }, [currentUser?.userId]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close sidebar on mobile when switching chats
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [userId]);

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
    socket?.emit("send-message", msg);
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
    <div className="flex h-[calc(100vh-4rem)] bg-white border border-gray-200 rounded-lg overflow-hidden animate-fade-in relative">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Conversations sidebar - Drawer on mobile, Sidebar on desktop */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs bg-white transform transition-transform duration-300 ease-in-out border-r border-gray-200
        md:relative md:translate-x-0 md:w-1/3 lg:w-1/4 md:z-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between md:hidden">
            <h2 className="font-bold text-gray-800">Conversations</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </Button>
          </div>
          <ChatUserList conversation={conversation || null} showTitle={false} />
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        {chatPartner ? (
          <>
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
              <div className="flex items-center">
                {/* Mobile Sidebar Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2 md:hidden p-1"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <MessageSquare size={20} />
                </Button>

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
                    className={`text-sm ${isTyping || chatPartner.isOnline
                      ? "text-green-500"
                      : "text-gray-500"
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
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(
                      `audio-call/${currentUser!.userId.slice(
                        0,
                        5
                      )}&${chatPartner!._id.slice(0, 5)}/${false}`
                    );
                  }}
                >
                  <Phone size={18} />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-2"
                  aria-label="Video call"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(
                      `video-call/${currentUser!.userId.slice(
                        0,
                        5
                      )}&${chatPartner!._id.slice(0, 5)}/${false}`
                    );
                  }}
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
                    socket?.emit("typing", chatPartner._id);
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
