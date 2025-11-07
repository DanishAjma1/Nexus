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
  const [checkStatus, setCheckStatus] = useState(false);
  const [conversation, setConversation] = useState<any | null>();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [chatPartner, setChatPartner] = useState<User | null>(null);
  const [users, setUsers] = useState<Record<string, User>>({});
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

  // Load chat partner and messages
  useEffect(() => {
    if (!currentUser?.userId || !userId) return;
    const fetchUserData = async () => {
      const partner = await getUserFromDb(userId);
      setChatPartner(partner || null);

      const messages = await getMessagesBetweenUsers(currentUser.userId, userId);
      setMessages(messages.length > 0 ? messages : []);
    };
    fetchUserData();
  }, [currentUser?.userId, userId]);

  // Load message senders
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
    if (messages.length > 0) fetchUsers();
  }, [messages]);

  // Socket listeners
  useEffect(() => {
    socket?.on("received-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket?.on("is-typing", () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    });

    socket?.on("check-user-status", () => setCheckStatus(!checkStatus));

    return () => {
      socket?.off("send-message");
      socket?.off("received-message");
      socket?.off("accept-call");
      socket?.off("reject-call");
    };
  }, [socket, currentUser?.userId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message handler
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

    const con = {
      sender: currentUser?.userId,
      receiver: userId,
      lastMessage: { ...msg },
    };
    const updatedConv = await updateConversationsForUser(con);
    if (updatedConv) setConversation(updatedConv);
  };

  if (!currentUser) return null;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-black border border-yellow-600 rounded-lg overflow-hidden animate-fade-in">
      {/* Conversations sidebar */}
      <div className="hidden md:block w-1/3 lg:w-1/4 border-r border-yellow-700 bg-neutral-900">
        <ChatUserList conversation={conversation || null} />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col text-yellow-100">
        {chatPartner ? (
          <>
            {/* Chat header */}
            <div className="border-b border-yellow-700 p-4 flex justify-between items-center bg-neutral-950">
              <div className="flex items-center">
                <Avatar
                  src={chatPartner.avatarUrl}
                  alt={chatPartner.name}
                  size="md"
                  status={chatPartner.isOnline ? "online" : "offline"}
                  className="mr-3"
                />
                <div>
                  <h2 className="text-lg font-semibold text-yellow-400">
                    {chatPartner.name}
                  </h2>
                  <p
                    className={`text-sm ${
                      isTyping
                        ? "text-green-400"
                        : chatPartner.isOnline
                        ? "text-yellow-300"
                        : "text-yellow-700"
                    }`}
                  >
                    {isTyping
                      ? "typing..."
                      : chatPartner.isOnline
                      ? "online"
                      : "offline"}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                {[
                  { Icon: Phone, path: "audio-call" },
                  { Icon: Video, path: "video-call" },
                  { Icon: Info, path: "info" },
                ].map(({ Icon, path }) => (
                  <Button
                    key={path}
                    variant="ghost"
                    size="sm"
                    className="rounded-full p-2 hover:bg-yellow-500 hover:text-black transition"
                    onClick={() =>
                      path !== "info" &&
                      navigate(
                        `${path}/${currentUser?.userId.slice(
                          0,
                          5
                        )}&${chatPartner?._id.slice(0, 5)}`
                      )
                    }
                  >
                    <Icon size={18} />
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 p-4 overflow-y-auto bg-black">
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
                  <div className="bg-yellow-900 p-4 rounded-full mb-4">
                    <MessageCircle size={32} className="text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-medium text-yellow-400">
                    No messages yet
                  </h3>
                  <p className="text-yellow-600 mt-1">
                    Send a message to start chatting
                  </p>
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="border-t border-yellow-700 p-4 bg-neutral-950">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-2 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                >
                  <Smile size={20} />
                </Button>

                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => {
                    socket?.emit("typing", chatPartner?._id);
                    setNewMessage(e.target.value);
                  }}
                  fullWidth
                  className="flex-1 bg-neutral-800 text-yellow-100 placeholder-yellow-700 border border-yellow-600 focus:ring-yellow-500"
                />

                <Button
                  type="submit"
                  size="sm"
                  disabled={!newMessage.trim()}
                  className="rounded-full p-2 w-10 h-10 flex items-center justify-center bg-yellow-500 text-black hover:bg-yellow-400 transition"
                >
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4 bg-black">
            <div className="bg-yellow-900 p-6 rounded-full mb-4">
              <MessageCircle size={48} className="text-yellow-400" />
            </div>
            <h2 className="text-xl font-semibold text-yellow-400">
              Select a conversation
            </h2>
            <p className="text-yellow-600 mt-2 text-center">
              Choose a contact from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
