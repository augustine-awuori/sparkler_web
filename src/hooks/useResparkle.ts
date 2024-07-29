import { Activity } from "getstream";
import { useFeedContext } from "react-activity-feed";

import { Activity as AppActivity } from "../utils/types";
import useNotification from "./useNotification";
import useUser from "./useUser";

const verb = "resparkle";

export default function useLike() {
  const feed = useFeedContext();
  const { createNotification } = useNotification();
  const { user } = useUser();

  const toggleSparkle = async (activity: Activity, hasResparkled: boolean) => {
    const appActivity = activity as unknown as AppActivity;
    const actor = appActivity.actor;

    await feed.onToggleReaction(
      verb,
      activity,
      {},
      { targetFeeds: [`user:${user?._id}`], trackAnalytics: true }
    );

    if (!hasResparkled && actor.id !== user?._id)
      createNotification(
        actor.id,
        verb,
        {},
        `SO:tweet:${appActivity.object.id}`
      );
  };

  return { toggleResparkle: toggleSparkle };
}
