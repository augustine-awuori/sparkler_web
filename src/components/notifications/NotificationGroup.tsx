import { useEffect, useRef } from "react";
import { useFeedContext, useStreamContext } from "react-activity-feed";
import { NotificationActivity } from "getstream";

import { SPARKLE_VERB } from "../../hooks/useSparkle";
import CommentNotification from "./CommentNotification";
import FollowNotification from "./FollowNotification";
import LikeNotification from "./LikeNotification";
import MentionNotification from "./MentionNotification";

interface Props {
  activityGroup: NotificationActivity;
}

export default function NotificationGroup({ activityGroup }: Props) {
  const { user, client } = useStreamContext();
  const feed = useFeedContext();
  const notificationContainerRef = useRef<HTMLDivElement>(null);

  const { verb } = activityGroup;

  useEffect(() => {
    // stop event propagation on links
    if (!notificationContainerRef.current) return;

    const anchorTags = notificationContainerRef.current.querySelectorAll("a");

    anchorTags.forEach((element) => {
      element.addEventListener("click", (e) => e.stopPropagation());
    });

    return () =>
      anchorTags.forEach((element) => {
        element.removeEventListener("click", (e) => e.stopPropagation());
      });
  }, []);

  useEffect(() => {
    const notificationFeed = client?.feed("notification", user?.id);

    notificationFeed?.subscribe((message) => {
      if (message.new.length) feed.refresh();
    });

    return () => notificationFeed?.unsubscribe();
  }, [client, feed, user?.id]);

  return (
    <div ref={notificationContainerRef}>
      {verb === SPARKLE_VERB && (
        <MentionNotification activityGroup={activityGroup} />
      )}
      {verb === "like" && <LikeNotification activityGroup={activityGroup} />}
      {verb === "follow" && (
        <FollowNotification activityGroup={activityGroup} />
      )}
      {verb === "comment" && (
        <CommentNotification activityGroup={activityGroup} />
      )}
    </div>
  );
}
