import { FlatFeed, LoadMorePaginator } from "react-activity-feed";

import { LoadMoreButton } from "./ProfileSparkles";
import { ProfileMediaPlaceholder } from "../placeholders";
import { useProfile } from "../../hooks";
import LoadingIndicator from "../LoadingIndicator";
import SparkleBlock from "../sparkle/SparkleBlock";

const ProfileMedia = () => {
  const { user } = useProfile();

  if (!user) return null;

  return (
    <FlatFeed
      Activity={SparkleBlock}
      userId={user?.id}
      feedGroup="user"
      notify
      LoadingIndicator={LoadingIndicator}
      Placeholder={<ProfileMediaPlaceholder />}
      Paginator={(props) => (
        <LoadMorePaginator
          {...props}
          LoadMoreButton={(props) => <LoadMoreButton {...props} />}
        />
      )}
    />
  );
};

export default ProfileMedia;
