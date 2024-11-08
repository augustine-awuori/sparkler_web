import { FlatFeed, useStreamContext } from "react-activity-feed";
import { Flex, Heading, Text, IconButton } from "@chakra-ui/react";
import { IoSparkles } from "react-icons/io5";

import { useShowSparkleModal } from "../../hooks";
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
  </Flex>
);

export default function Timeline() {
  const { user } = useStreamContext();
  const { setShowSparkleModal } = useShowSparkleModal();

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
      <IconButton
        _hover={{ backgroundColor: "var(--theme-color)" }}
        aria-label="icon"
        background="var(--theme-color)"
        borderRadius="full"
        bottom="5rem"
        boxShadow="lg"
        display={{ base: "flex", md: "none" }}
        icon={<IoSparkles color="#fff" />}
        onClick={() => setShowSparkleModal(true)}
        position="fixed"
        right="20px"
        size="lg"
      />
    </div>
  );
}
