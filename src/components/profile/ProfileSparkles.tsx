import { FlatFeed, LoadMorePaginator } from "react-activity-feed";

import { ProfileSparklesPlaceholder } from "../placeholders";
import { useProfileUser } from "../../hooks";
import LoadingIndicator from "../LoadingIndicator";
import LoadMoreButton from "../LoadMoreButton";
import SparkleBlock from "../sparkle/SparkleBlock";

export default function ProfileSparkles() {
  const { user } = useProfileUser();

  return (
    <FlatFeed
      Activity={SparkleBlock}
      userId={user?.id}
      feedGroup="user"
      notify
      LoadingIndicator={LoadingIndicator}
      Placeholder={<ProfileSparklesPlaceholder />}
      Paginator={(props) => (
        <LoadMorePaginator
          {...props}
          LoadMoreButton={(props) => <LoadMoreButton {...props} />}
        />
      )}
    />
  );
}
