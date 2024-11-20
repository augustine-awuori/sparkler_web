import { useEffect } from "react";
import {
  FlatFeed,
  LoadMorePaginator,
  useStreamContext,
} from "react-activity-feed";
import { Flex, Heading, Text, IconButton } from "@chakra-ui/react";
import { IoSparkles } from "react-icons/io5";

import { useShowSparkleModal, useUser } from "../../hooks";
import auth from "../../services/auth";
import LoadingIndicator from "../LoadingIndicator";
import LoadMoreButton from "../LoadMoreButton";
import SparkleBlock from "../sparkle/SparkleBlock";
import usersService from "../../services/users";

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
  const { client } = useStreamContext();
  const { user } = useStreamContext();
  const { setShowSparkleModal } = useShowSparkleModal();
  const { user: currentUser } = useUser();

  useEffect(() => {
    const logOutUser = async () => {
      await auth.logout();
      window.location.reload();
    };

    const deleteInvalidAccount = async () => {
      if (!currentUser?.invalid) return;
      if (!client?.currentUser) return;

      await client.currentUser.delete();
      await usersService.deleteUserAccont();

      logOutUser();
    };

    deleteInvalidAccount();
  }, [client?.currentUser, currentUser?.invalid]);

  if (!user) return <Heading>User not logged in</Heading>;

  return (
    <div className="test">
      <FlatFeed
        Activity={SparkleBlock}
        userId={user.id}
        feedGroup="timeline"
        LoadingIndicator={LoadingIndicator}
        Placeholder={Placeholder}
        Paginator={(props) => (
          <LoadMorePaginator
            {...props}
            LoadMoreButton={(props) => <LoadMoreButton {...props} />}
          />
        )}
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
