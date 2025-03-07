import { LoadMoreButtonProps } from "react-activity-feed/dist/components/LoadMoreButton";
import { Box, Button } from "@chakra-ui/react";
import { ImSpinner9 } from "react-icons/im";

const LoadMoreButton = ({ onClick, refreshing }: LoadMoreButtonProps) => (
  <Box textAlign="center" my={4}>
    <Button
      borderRadius="full"
      onClick={onClick}
      size="sm"
      bg="var(--theme-color)"
      color="#fff"
      _hover={{ bg: "var(--primary-color)" }}
      leftIcon={<ImSpinner9 />}
      isLoading={refreshing}
    >
      Load More
    </Button>
  </Box>
);

export default LoadMoreButton;
