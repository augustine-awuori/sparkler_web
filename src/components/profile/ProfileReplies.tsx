import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { useProfile } from "../../hooks";
import SparkleBlock from "../sparkle/SparkleBlock";
import { Activity } from "getstream";
import { ProfileResparklesPlaceholder } from "../placeholders";
import LoadingIndicator from "../LoadingIndicator";

export default function ProfileTweets() {
  const { user } = useProfile();
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
        ).filter((activity) => activity.verb === "resparkle");

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
