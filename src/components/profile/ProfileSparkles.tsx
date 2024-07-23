import { FlatFeed } from "react-activity-feed";

import { useProfile } from "../../hooks";
import SparkleBlock from "../sparkle/SparkleBlock";

export default function ProfileSparkles() {
  const { user } = useProfile();

  return (
    <FlatFeed
      Activity={SparkleBlock}
      userId={user?.id}
      feedGroup="user"
      notify
    />
  );
}
