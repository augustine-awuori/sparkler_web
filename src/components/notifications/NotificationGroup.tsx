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
  const feed = useFeedContext();
  const notificationContainerRef = useRef<HTMLDivElement>(null);
  const { user, client } = useStreamContext();

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
    const notifFeed = client?.feed("notification", user?.id);

    notifFeed?.subscribe((data) => {
      if (data.new.length) feed.refresh();
    });

    return () => notifFeed?.unsubscribe();
  }, [client, user, feed]);

  return (
    <div ref={notificationContainerRef}>
      {activityGroup.verb === SPARKLE_VERB && (
        <MentionNotification activityGroup={activityGroup} />
      )}
      {activityGroup.verb === "like" && (
        <LikeNotification likeGroupActivity={activityGroup} />
      )}
      {activityGroup.verb === "follow" && (
        <FollowNotification followActivities={activityGroup} />
      )}
      {activityGroup.verb === "comment" && (
        <CommentNotification activity={activityGroup} />
      )}
    </div>
  );
}
