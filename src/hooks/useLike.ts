import { Activity } from "getstream";
import { useFeedContext } from "react-activity-feed";

export default function useLike() {
  const feed = useFeedContext();

  const toggleLike = async (activity: Activity, hasLikedTweet: boolean) => {
    await feed.onToggleReaction("like", activity);
  };

  return { toggleLike };
}
