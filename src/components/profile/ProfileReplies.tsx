import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { Activity } from "getstream";

import { ProfileResparklesPlaceholder } from "../placeholders";
import { useProfileUser } from "../../hooks";
import LoadingIndicator from "../LoadingIndicator";
import SparkleBlock from "../sparkle/SparkleBlock";

export default function ProfileTweets() {
  const { user } = useProfileUser();
  const { client } = useStreamContext();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const feed = client?.feed("user", user?.id);

    async function getActivities() {
      setLoading(true);
      const response = await feed?.get({
        withOwnReactions: true,
        enrich: true,
        ownReactions: true,
        withReactionCounts: true,
        withRecentReactions: true,
      });
      setLoading(false);

      if (response) {
        const filteredActivities = (
          response.results as unknown as Activity[]
        ).filter(
          (activity) =>
            activity.verb === "resparkle" || activity.verb === "quote"
        );

        setActivities(filteredActivities);
      }
    }

    getActivities();
  }, [user?.id, client]);

  if (loading) return <LoadingIndicator />;

  if (!activities.length) return <ProfileResparklesPlaceholder />;

  return (
    <>
      {activities.map((activity) => (
        <SparkleBlock key={activity.id} activity={activity} />
      ))}
    </>
  );
}
