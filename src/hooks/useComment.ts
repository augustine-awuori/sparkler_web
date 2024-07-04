import { Activity } from "getstream";
import { useFeedContext } from "react-activity-feed";

export default function useComment() {
  const feed = useFeedContext();

  const createComment = async (text: string, activity: Activity) => {
    await feed.onAddReaction("comment", activity, { text });
  };

  return { createComment };
}
