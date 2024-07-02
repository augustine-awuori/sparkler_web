import { FlatFeed, useStreamContext } from "react-activity-feed";
import { Heading } from "@chakra-ui/react";

import SparkleBlock from "../sparkle/SparkleBlock";

export default function Timeline() {
  const { user } = useStreamContext();

  if (!user) return <Heading>User not logged in</Heading>;

  return (
    <div>
      <FlatFeed Activity={SparkleBlock} userId={user.id} feedGroup="timeline" />
    </div>
  );
}
