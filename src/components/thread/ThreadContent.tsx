import { useEffect, useState } from "react";
import { useFeedContext, useStreamContext } from "react-activity-feed";
import { useParams } from "react-router-dom";
import { Activity } from "getstream";
import { Map } from "immutable";

import LoadingIndicator from "../LoadingIndicator";
import TweetContent from "./SparkleContent";
import ThreadHeader from "./ThreadHeader";

export default function ThreadContent() {
  const { client } = useStreamContext();
  const { id } = useParams();
  const feed = useFeedContext();
  const [activity, setActivity] = useState<Activity>();

  useEffect(() => {
    if (feed.refreshing || !feed.hasDoneRequest || !id) return;

    const activityPaths = feed.feedManager.getActivityPaths(id) || [];

    if (activityPaths.length) {
      const targetActivity = (
        feed.feedManager.state.activities.getIn([...activityPaths[0]]) as Map<
          string,
          Activity
        >
      ).toJS();
      setActivity(targetActivity as Activity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feed.refreshing, id]);

  if (!client || !activity) return <LoadingIndicator />;

  return (
    <div>
      <ThreadHeader />
      <TweetContent activity={activity} />
    </div>
  );
}
