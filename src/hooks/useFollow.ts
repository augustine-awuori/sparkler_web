import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import useNotification from "./useNotification";

interface Props {
  userId: string;
}

export default function useFollow({ userId }: Props) {
  const { client } = useStreamContext();
  const [isFollowing, setIsFollowing] = useState(false);
  const { createNotification } = useNotification();

  useEffect(() => {
    async function init() {
      try {
        const response = await client
          ?.feed("timeline", client.userId)
          .following({ filter: [`user:${userId}`] });

        setIsFollowing(!!response?.results.length);
      } catch (error) {}
    }

    init();
  }, [userId, client]);

  const toggleFollow = async () => {
    const action = isFollowing ? "unfollow" : "follow";

    if (action === "follow") await createNotification(userId, action);

    const timelineFeed = client?.feed("timeline", client.userId);
    await timelineFeed?.[action]("user", userId);

    setIsFollowing((isFollowing) => !isFollowing);
  };

  return { isFollowing, toggleFollow };
}
