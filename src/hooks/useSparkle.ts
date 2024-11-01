import { nanoid } from "nanoid";
import { useStreamContext } from "react-activity-feed";
import { toast } from "react-toastify";

import { Activity } from "../utils/types";
import { getEATZone } from "../utils/funcs";
import { parseHashtags } from "../utils/string";
import useUser from "./useUser";

export default function useSparkle() {
  const { client } = useStreamContext();
  const { user } = useUser();

  const userFeed = client?.feed("user", client.userId);

  const getComputedHashtags = (hashtags: string[]): string[] | undefined => {
    if (!hashtags.length || !user) return undefined;

    const computed = [
      ...hashtags.map((tag) => `hashtags:${tag.toLowerCase()}`),
      "hashtags:general",
    ];

    if (user.verified) computed.push("hashtags:verified");

    return computed;
  };

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

    const time = getEATZone();

    await userFeed.addActivity({
      actor: `SU:${client.userId}`,
      verb: "tweet",
      attachments: { images },
      object: `SO:tweet:${collection.id}`,
      foreign_id: client.userId + time,
      time: time,
      to: getComputedHashtags(parseHashtags(text)),
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
