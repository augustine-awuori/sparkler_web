import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { toast } from "react-toastify";

import { User } from "../users";
import service from "../services/users";
import useNotification from "./useNotification";
import useUser from "./useUser";

interface Props {
  userId: string;
}

export default function useFollow({ userId }: Props) {
  const [isFollowing, setIsFollowing] = useState(false);
  const { client } = useStreamContext();
  const { createNotification } = useNotification();
  const { user, setUser } = useUser();

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
    if (!user) return toast.info("Login to follow user");

    const action = isFollowing ? "unfollow" : "follow";
    if (action === "follow") await createNotification(userId, action);

    const timelineFeed = client?.feed("timeline", client.userId);
    await timelineFeed?.[action]("user", userId);
    setIsFollowing((isFollowing) => !isFollowing);

    const res = await service.updateFollowers(userId);
    if (res.ok) setUser(res.data as User);
  };

  return { isFollowing, toggleFollow };
}
