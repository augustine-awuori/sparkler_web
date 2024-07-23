import { Activity } from "getstream";
import { useFeedContext } from "react-activity-feed";

import { Activity as AppActivity } from "../utils/types";
import useNotification from "./useNotification";
import useUser from "./useUser";

export default function useLike() {
  const feed = useFeedContext();
  const { createNotification } = useNotification();
  const { user } = useUser();

  const toggleLike = async (activity: Activity, hasLikedTweet: boolean) => {
    const appActivity = activity as unknown as AppActivity;
    const actor = appActivity.actor;

    await feed.onToggleReaction("like", activity);

    if (!hasLikedTweet && actor.id !== user?._id)
      createNotification(
        actor.id,
        "like",
        {},
        `SO:tweet:${appActivity.object.id}`
      );
  };

  return { toggleLike };
}
