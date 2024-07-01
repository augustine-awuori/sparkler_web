import { FlatFeed, useStreamContext } from "react-activity-feed";

import { User } from "../../users";
import SparkleBlock from "../sparkle/SparkleBlock";

export default function Timeline() {
  const { user } = useStreamContext();

  return (
    <div>
      <FlatFeed
        Activity={SparkleBlock}
        userId={(user as unknown as User).id}
        feedGroup="user"
      />
    </div>
  );
}
