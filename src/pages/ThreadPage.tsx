import { useEffect } from "react";
import { Feed, useStreamContext } from "react-activity-feed";
import { useParams } from "react-router-dom";

import ThreadContent from "../components/thread/ThreadContent";

const FEED_ENRICH_OPTIONS = {
  withRecentReactions: true,
  withOwnReactions: true,
  withReactionCounts: true,
  withOwnChildren: true,
};

export default function Thread() {
  const { user } = useStreamContext();
  const { username } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Feed
      feedGroup={user?.id === username ? "user" : "timeline"}
      options={FEED_ENRICH_OPTIONS}
      notify
    >
      <ThreadContent />
    </Feed>
  );
}
