import { FlatFeed, useStreamContext } from "react-activity-feed";
import { Flex, Heading, Text } from "@chakra-ui/react";

import LoadingIndicator from "../LoadingIndicator";
import SparkleBlock from "../sparkle/SparkleBlock";

const Placeholder = () => (
  <Flex
    direction="column"
    align="center"
    justify="center"
    height="100vh"
    p={4}
    pt={0}
  >
    <Heading
      fontWeight={800}
      textAlign="center"
      mb={4}
      color="gray.700"
      fontFamily="Quicksand"
    >
      Your Feed is Looking a Little Empty
    </Heading>
    <Text fontSize="lg" textAlign="center" color="gray.500" mb={2}>
      It’s time to add some sparkle to your timeline!
    </Text>
    <Text fontSize="md" textAlign="center" color="gray.500">
      Start following interesting users and watch your feed come to life with
      new sparkles.
    </Text>
    <Text fontSize="sm" textAlign="center" color="gray.400" mt={4}>
      Explore, engage, and enjoy the journey!
    </Text>
  </Flex>
);

export default function Timeline() {
  const { user } = useStreamContext();

  if (!user) return <Heading>User not logged in</Heading>;

  return (
    <div>
      <FlatFeed
        Activity={SparkleBlock}
        userId={user.id}
        feedGroup="timeline"
        LoadingIndicator={LoadingIndicator}
        Placeholder={Placeholder}
      />
    </div>
  );
}
