import { FlatFeed, LoadMorePaginator } from "react-activity-feed";
import { LoadMoreButtonProps } from "react-activity-feed/dist/components/LoadMoreButton";
import { Box, Button } from "@chakra-ui/react";
import { ImSpinner9 } from "react-icons/im";

import { ProfileSparklesPlaceholder } from "../placeholders";
import { useProfile } from "../../hooks";
import LoadingIndicator from "../LoadingIndicator";
import SparkleBlock from "../sparkle/SparkleBlock";

export const LoadMoreButton = ({
  onClick,
  refreshing,
}: LoadMoreButtonProps) => (
  <Box textAlign="center" mt={4}>
    <Button
      borderRadius="full"
      onClick={onClick}
      size="sm"
      bg="var(--theme-color)"
      color="#fff"
      _hover={{ bg: "var(--conc-theme-color)" }}
      leftIcon={<ImSpinner9 />}
      isLoading={refreshing}
    >
      Load More
    </Button>
  </Box>
);

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
      Paginator={(props) => (
        <LoadMorePaginator
          {...props}
          LoadMoreButton={(props) => <LoadMoreButton {...props} />}
        />
      )}
    />
  );
}
