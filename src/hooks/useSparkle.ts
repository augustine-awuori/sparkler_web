import { nanoid } from "nanoid";
import { useStreamContext } from "react-activity-feed";
import { toast } from "react-toastify";

import { Activity } from "../utils/types";
import { parseHashtags } from "../utils/string";
import useUser from "./useUser";

export default function useSparkle() {
  const { client } = useStreamContext();
  const { user } = useUser();

  const userFeed = client?.feed("user", client.userId);

  const createSparkle = async (text: string, images: string[]) => {
    if (!user) {
      toast.info("Login to sparkle");
      return;
    }

    if (!client || !userFeed) {
      toast.error("Sparkle could not be created");
      return;
    }

    const collection = await client.collections.add("tweet", nanoid(), {
      text,
    });

    const time = new Date();
    const eatTime = new Date(time.getTime() + 3 * 60 * 60 * 1000).toISOString(); // Add 3 hours to current time

    const hashtags = parseHashtags(text);
    const to = hashtags.length
      ? [...hashtags.map((tag) => `hashtags:${tag}`), "hashtags:general"]
      : undefined;

    await userFeed.addActivity({
      actor: `SU:${client.userId}`,
      verb: "tweet",
      attachments: { images },
      object: `SO:tweet:${collection.id}`,
      foreign_id: client.userId + eatTime,
      time: eatTime,
      to,
    });
  };

  const deleteSparkle = (sparkleId: string) => {
    userFeed?.removeActivity(sparkleId);
  };

  const checkIfHasResparkled = (activity: Activity) => {
    let hasResparkled = false;

    if (activity?.own_reactions?.resparkle && user) {
      const myReaction = activity.own_reactions.resparkle.find(
        (act) => act.user.id === user._id
      );
      hasResparkled = Boolean(myReaction);
    }

    return hasResparkled;
  };

  const checkIfHasLiked = (activity: Activity) => {
    let hasLikedSparkle = false;

    if (activity?.own_reactions?.like && user) {
      const myReaction = activity.own_reactions.like.find(
        (l) => l.user.id === user?._id
      );
      hasLikedSparkle = Boolean(myReaction);
    }

    return hasLikedSparkle;
  };

  return {
    createSparkle,
    deleteSparkle,
    checkIfHasLiked,
    checkIfHasResparkled,
  };
}
