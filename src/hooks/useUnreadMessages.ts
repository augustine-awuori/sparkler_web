import { useEffect, useState } from "react";
import { GetUnreadCountAPIResponse } from "stream-chat";
import { useChatContext } from "stream-chat-react";

const useUnreadMessages = () => {
  const { client } = useChatContext();
  const [countResponse, setCountResponse] =
    useState<GetUnreadCountAPIResponse>();

  useEffect(() => {
    if (!client) return;

    fetchUnreadCount();

    const handleNewMessage = () => fetchUnreadCount();

    const handleReadMessage = () => fetchUnreadCount();

    client.on("message.new", handleNewMessage);
    client.on("message.read", handleReadMessage);

    return () => {
      client.off("message.new", handleNewMessage);
      client.off("message.read", handleReadMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  async function fetchUnreadCount() {
    try {
      if (client) {
        const count = await client.getUnreadCount();
        setCountResponse(count);
      }
    } catch (error) {}
  }

  return { countResponse, count: countResponse?.total_unread_count || 0 };
};

export default useUnreadMessages;
