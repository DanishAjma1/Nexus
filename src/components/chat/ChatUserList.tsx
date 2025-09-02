import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ChatConversation, User } from "../../types";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { useAuth } from "../../context/AuthContext";
import { getUserFromDb } from "../../data/users";

interface ChatUserListProps {
  conversation: ChatConversation;
}

export const ChatUserList: React.FC<ChatUserListProps> = ({ conversation }) => {
  const navigate = useNavigate();
  const { userId: activeUserId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();

  const [participants, setParticipants] = useState<User[]>([]);
  const [lastMessage, setLastMessage] = useState({});

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!conversation?.participants) return;

      const allIds = Array.from(
        new Set(conversation.participants.flatMap((i) => i.receiverId || ""))
      );

      console.log(allIds);
      // fetch all users in parallel
      const users = await Promise.all(
        allIds.map(async (id) => await getUserFromDb(id))
      );

      // filter nulls (if any user not found)
      setParticipants(users.filter(Boolean) as User[]);

      const lastMessageIndex = conversation.participants.findIndex((part)=>{
        return part.receiverId === activeUserId
      });
      
      setLastMessage({...conversation.participants[lastMessageIndex].lastMessage});
    };

    fetchParticipants();
  }, [conversation, currentUser,activeUserId]);

  if (conversation === null) return;
  if (!currentUser) return null;
  const handleSelectUser = (userId: string) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="bg-white border-r border-gray-200 w-full md:w-64 overflow-y-auto">
      <div className="py-4">
        <h2 className="px-4 text-lg font-semibold text-gray-800 mb-4">
          Messages
        </h2>

        <div className="space-y-1">
          {participants.length > 0 ? (
            participants.map((user) => {
              const isActive = user._id === activeUserId; // highlight current open chat

              return (
                <div
                  key={user._id}
                  className={`px-4 py-3 flex cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? "bg-primary-50 border-l-4 border-primary-600"
                      : "hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                  onClick={() => handleSelectUser(user._id)}
                >
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.name}
                    size="md"
                    status={user.isOnline ? "online" : "offline"}
                    className="mr-3 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {user.name.slice(0, 5)}
                        {"..."}
                      </h3>

                      {lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(
                            new Date(conversation?.lastModified),
                            { addSuffix: false }
                          )}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-1">
                      {lastMessage && (
                        <p className="text-xs text-gray-600 truncate">
                          {lastMessage.senderId === currentUser.userId
                            ? "You: "
                            : ""}
                          {lastMessage.content}
                        </p>
                      )}

                      {lastMessage &&
                        !lastMessage.isRead &&
                        lastMessage.senderId !== currentUser.userId && (
                          <Badge variant="primary" size="sm" rounded>
                            New
                          </Badge>
                        )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-500">No conversations yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
