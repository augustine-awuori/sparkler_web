import { Activity } from "getstream";
import { useFeedContext } from "react-activity-feed";
import { toast } from "react-toastify";

import { Activity as AppActivity } from "../utils/types";
import useNotification from "./useNotification";
import useUser from "./useUser";

export default function useComment() {
  const feed = useFeedContext();
  const { createNotification } = useNotification();
  const { user } = useUser();

  const createComment = async (
    text: string,
    activity: Activity,
    verb = "comment"
  ) => {
    if (!text) {
      toast.info("Add a valid comment");
      return;
    }

    if (!activity) {
      console.error("Activity is empty or undefined.");
      return;
    }

    const appActivity = activity as unknown as AppActivity;
    const actor = appActivity.actor;

    if (!actor || !appActivity.object) {
      console.error("Activity actor or object is missing.");
      return;
    }

    try {
      const currentTime = new Date();
      const eatTime = new Date(
        currentTime.getTime() + 3 * 60 * 60 * 1000
      ).toISOString();

      await feed.onAddReaction(verb, appActivity as unknown as Activity, {
        text,
        eatTime,
      });

      if (actor.id !== user?._id) {
        createNotification(
          actor.id,
          verb,
          { text, time: eatTime },
          `SO:tweet:${appActivity.object.id}`
        );
      }
    } catch (error) {
      console.error("Failed to add comment reaction:", error);
    }
  };

  return { createComment };
}
