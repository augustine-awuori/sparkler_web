import { Activity } from "getstream";
import { nanoid } from "nanoid";
import { useFeedContext, useStreamContext } from "react-activity-feed";
import { toast } from "react-toastify";

import { Activity as SparkleActivity } from "../utils/types";
import { getEATZone } from "../utils/funcs";
import { getHashtags, getMentions } from "../utils/string";
import useUser from "./useUser";
import useUsers from "./useUsers";

export const SPARKLE_VERB = "sparkle";

export default function useSparkle() {
  const { client } = useStreamContext();
  const { user } = useUser();
  const { getUserIds } = useUsers();
  const feed = useFeedContext();

  const userFeed = client?.feed("user", client.userId);

  const prepareMentionsIdsTags = (mentionsIds: string[]): string[] =>
    mentionsIds.length ? mentionsIds.map((id) => `notification:${id}`) : [];

  const prepareHashtagTags = (hashtags: string[]): string[] => {
    if (!hashtags.length || !user) return [];

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

    const collection = await client.collections.add(SPARKLE_VERB, nanoid(), {
      text,
    });

    const time = getEATZone();

    const mentionsIdsTags = prepareMentionsIdsTags(
      getUserIds(getMentions(text))
    );
    const hashtagTags = prepareHashtagTags(getHashtags(text));

    await userFeed.addActivity({
      actor: `SU:${client.userId}`,
      verb: SPARKLE_VERB,
      attachments: { images },
      object: `SO:${SPARKLE_VERB}:${collection.id}`,
      foreign_id: client.userId + time,
      time: time,
      to: [...mentionsIdsTags, ...hashtagTags],
    });
  };

  const toggleBookmark = async (sparkle: Activity) => {
    try {
      if (!user) return toast("Login to bookmark");

      await feed?.onToggleReaction("bookmark", sparkle);
    } catch (error) {
      toast.error("Error bookmarking/unbookmarking a sparkle");
    }
  };

  const deleteSparkle = (sparkleId: string) =>
    userFeed?.removeActivity(sparkleId);

  const hasResparkled = (sparkle: Activity | SparkleActivity): boolean =>
    Boolean((sparkle as unknown as SparkleActivity).own_reactions?.resparkle);

  const hasLiked = (sparkle: Activity | SparkleActivity): boolean =>
    Boolean((sparkle as unknown as SparkleActivity).own_reactions?.like);

  const hasBookmarked = (sparkle: Activity | SparkleActivity): boolean =>
    Boolean((sparkle as unknown as SparkleActivity).own_reactions?.bookmark);

  return {
    createSparkle,
    deleteSparkle,
    hasBookmarked,
    hasLiked,
    hasResparkled,
    toggleBookmark,
  };
}
