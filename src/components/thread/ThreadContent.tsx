import { useEffect, useState } from "react";
import { useFeedContext, useStreamContext } from "react-activity-feed";
import { useNavigate, useParams } from "react-router-dom";
import { Activity } from "getstream";
import { Map } from "immutable";

import { Activity as AppActivity } from "../../utils/types";
import { generateSparkleLink } from "../../utils/links";
import LoadingIndicator from "../LoadingIndicator";
import Header from "../Header";
import SparkleContent from "./SparkleContent";

export default function ThreadContent() {
  const [activity, setActivity] = useState<Activity>();
  const { client } = useStreamContext();
  const { id } = useParams();
  const feed = useFeedContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSparkle = async () => {
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
      } else {
        const userFeed = client?.feed("user", client.userId);
        const activities = ((await userFeed?.get({}))?.results ||
          []) as unknown as AppActivity[];

        const found = activities.find((activity) => activity.object.id === id);

        if (found && client?.userId)
          navigate(generateSparkleLink(client.userId, found.id));
      }
    };

    fetchSparkle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feed.refreshing, id]);

  if (!client || !activity) return <LoadingIndicator />;

  return (
    <div>
      <Header />
      <SparkleContent activity={activity} />
    </div>
  );
}
