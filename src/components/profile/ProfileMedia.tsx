import { FlatFeed, LoadMorePaginator } from "react-activity-feed";

import { ProfileMediaPlaceholder } from "../placeholders";
import { useProfileUser } from "../../hooks";
import LoadingIndicator from "../LoadingIndicator";
import LoadMoreButton from "../LoadMoreButton";
import SparkleBlock from "../sparkle/SparkleBlock";

const ProfileMedia = () => {
  const { user } = useProfileUser();

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
