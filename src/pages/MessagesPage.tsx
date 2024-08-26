import { useEffect } from "react";
import { Text } from "@chakra-ui/react";
import {
  Channel,
  ChannelHeader,
  ChannelList,
  DefaultStreamChatGenerics,
  MessageInput,
  MessageList,
  Thread,
  useChatContext,
  Window,
} from "stream-chat-react";
import { ChannelSort } from "stream-chat";

import { useUser } from "../hooks";

const options = { presence: true, state: true };
const sort: ChannelSort<DefaultStreamChatGenerics> = {
  last_message_at: -1,
};

const EmptyStateIndicator = () => (
  <Text textAlign="center">You don't have any chats yet</Text>
);

const MessagesPage = () => {
  const { client, setActiveChannel } = useChatContext();
  const { user } = useUser();

  useEffect(() => {
    const createDMChannel = async () => {
      let sellerId = "";
      const params = new URLSearchParams(window.location.search);
      for (const [id] of params) sellerId = id;

      if (!user?._id || !sellerId) return;

      const channel = client.channel("messaging", {
        members: [user?._id, sellerId],
      });

      await channel.watch();
      setActiveChannel(channel);
    };

    createDMChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, user?._id]);

  if (!user) return <p>You're not logged in</p>;
  if (!client) return <p>App error</p>;

  return (
    <>
      <ChannelList
        sort={sort}
        EmptyStateIndicator={EmptyStateIndicator}
        filters={{ members: { $in: [user._id] }, type: "messaging" }}
        options={options}
        showChannelSearch
      />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </>
  );
};

export default MessagesPage;
