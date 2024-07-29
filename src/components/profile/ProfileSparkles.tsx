import { FlatFeed } from "react-activity-feed";

import { ProfileSparklesPlaceholder } from "../placeholders";
import { useProfile } from "../../hooks";
import LoadingIndicator from "../LoadingIndicator";
import SparkleBlock from "../sparkle/SparkleBlock";

export default function ProfileSparkles() {
  const { user } = useProfile();

  return (
    <FlatFeed
      Activity={SparkleBlock}
      userId={user?.id}
      feedGroup="user"
      notify
      LoadingIndicator={LoadingIndicator}
      Placeholder={<ProfileSparklesPlaceholder />}
    />
  );
}
