import { useContext } from "react";
import { FlatFeed } from "react-activity-feed";

import { ProfileContext } from "../contexts";
import SparkleBlock from "../sparkle/SparkleBlock";

export default function MyTweets() {
  const { user } = useContext(ProfileContext);

  return (
    <div>
      <FlatFeed
        Activity={SparkleBlock}
        userId={user?.id}
        feedGroup="user"
        notify
      />
    </div>
  );
}
