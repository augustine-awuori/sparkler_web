import { Activity } from "getstream";
import { useFeedContext } from "react-activity-feed";

import { Activity as AppActivity } from "../utils/types";
import useNotification from "./useNotification";
import useUser from "./useUser";

export default function useComment() {
  const feed = useFeedContext();
  const { createNotification } = useNotification();
  const { user } = useUser();

  const createComment = async (text: string, activity: Activity) => {
    const appActivity = activity as unknown as AppActivity;
    const actor = appActivity.actor;

    await feed.onAddReaction("comment", activity, { text });

    if (actor.id !== user?._id)
      createNotification(
        actor.id,
        "comment",
        { text },
        `SO:tweet:${appActivity.object.id}`
      );
  };

  return { createComment };
}
