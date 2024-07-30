import { Activity } from "getstream";
import { useFeedContext } from "react-activity-feed";
import { useState } from "react";

import { Activity as AppActivity } from "../utils/types";
import useNotification from "./useNotification";
import useUser from "./useUser";

async function fetchOriginalPost(
  activityId: string
): Promise<AppActivity | null> {
  try {
    // Replace this with your actual API call to fetch the original post
    const response = await fetch(`/api/posts/${activityId}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    console.error("Failed to fetch the original post data.");
    return null;
  } catch (error) {
    console.error("Error fetching the original post data:", error);
    return null;
  }
}

export default function useComment() {
  const feed = useFeedContext();
  const { createNotification } = useNotification();
  const { user } = useUser();
  const [originalPost, setOriginalPost] = useState<AppActivity | null>(null);

  const createComment = async (text: string, activity: Activity) => {
    // Type guard to ensure activity is of the correct type
    if (!activity) {
      console.error("Activity is empty or undefined.");
      return;
    }
    console.log("comment activity", activity);
    const appActivity = activity as unknown as AppActivity;
    const actor = appActivity.actor;

    if (!actor || !appActivity.object) {
      console.error("Activity actor or object is missing.");
      return;
    }

    if (!appActivity.object.data) {
      const originalPostData = await fetchOriginalPost(appActivity.id);
      if (originalPostData) {
        setOriginalPost(originalPostData);
      } else {
        console.error("Failed to fetch original post data.");
        return;
      }
    }

    const targetActivity = originalPost || appActivity;

    try {
      await feed.onAddReaction(
        "comment",
        targetActivity as unknown as Activity,
        { text }
      );

      if (actor.id !== user?._id) {
        createNotification(
          actor.id,
          "comment",
          { text },
          `SO:tweet:${targetActivity.object.id}`
        );
      }
    } catch (error) {
      console.error("Failed to add comment reaction:", error);
    }
  };

  return { createComment };
}
