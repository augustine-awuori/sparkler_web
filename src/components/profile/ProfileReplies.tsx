import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { useProfile } from "../../hooks";
import SparkleBlock from "../sparkle/SparkleBlock";
import { Activity } from "../../utils/types";

export default function ProfileTweets() {
  const { user } = useProfile();
  const { client } = useStreamContext();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const feed = client?.feed("user", user?.id);

    async function getActivities() {
      const response = await feed?.get({
        withOwnReactions: true,
      });

      if (response) {
        const filteredActivities = (
          response.results as unknown as Activity[]
        ).filter((activity) => activity.verb === "reply");
        setActivities(filteredActivities);
      }
    }

    getActivities();
  }, [user?.id, client]);

  return (
    <>
      {/* {activities.map((activity) => (
        <SparkleBlock key={""} activity={activity} />
      ))} */}
    </>
  );
}
