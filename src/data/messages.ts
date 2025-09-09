import axios from "axios";
const URL = import.meta.env.VITE_BACKEND_URL;
// Helper function to get messages between two users
export const getMessagesBetweenUsers = async (
  user1Id: string,
  user2Id: string
) => {
  const res = await axios.get(
    `${URL}/message/get-messages-btw-users?sender=${user1Id}&receiver=${user2Id}`,
    {
      withCredentials: true,
    }
  );
  const { messages } = res.data;
  return messages;
};

export const saveMessagesBetweenUsers = async (newMessage: Any) => {
  try {
    const res = await axios.post(`${URL}/message/save-message`, newMessage, {
      withCredentials: true,
    });
    console.log("message saved");
    const { message } = res.data;
    return message;
  } catch (err) {
    console.log(err);
  }
};
// Helper function to get conversations for a user
export const getConversationsForUser = async (
  currentUserId: string | undefined,
  partnerId: string | undefined
) => {
  // Get unique conversation partners
  const res = await axios.get(
    `${URL}/conversation/get-conversations-for-user?currentUserId=${currentUserId}&partnerId=${partnerId}`,
    {
      withCredentials: true,
    }
  );
  const { conversation } = res.data;
  return conversation;
};

export const addConversationsForUser = async (con: object): any[] => {
  // Get unique conversation partners
  const res = await axios.post(
    `${URL}/conversation/add-conversations-for-user`,
    con,
    {
      withCredentials: true,
    }
  );
  const { conversationForSender } = res.data;
  return conversationForSender;
};

export const updateConversationsForUser = async (con: object): any[] => {
  // Get unique conversation partners
  const res = await axios.post(
    `${URL}/conversation/update-conversations-for-user`,
    con,
    {
      withCredentials: true,
    }
  );
  const { conversationForSender } = res.data;
  return conversationForSender;
};
