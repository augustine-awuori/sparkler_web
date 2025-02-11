import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Spinner, Text } from "@chakra-ui/react";

import { FollowersResult } from "../utils/types";
import { User } from "../users";
import { useUsers } from "../hooks";
import UsersList from "../components/UsersList";
import usersService from "../services/users";

const FollowersPage = () => {
  const [followers, setFollowers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { idUserMap, usernameIdMap } = useUsers();
  const { username } = useParams();

  useEffect(() => {
    const loadFollowers = async () => {
      if (!username) return;

      const userId = usernameIdMap[username];
      if (!userId) return;

      setLoading(true);
      const res = await usersService.getUserFollowers(userId);

      if (res.ok)
        setFollowers(
          (res.data as FollowersResult)
            .map(({ feed_id }) => {
              return idUserMap[feed_id.replace("timeline:", "")];
            })
            .filter((user) => user?._id)
        );
      setLoading(false);
    };

    loadFollowers();
    window.scroll(0, 0);
  }, [idUserMap, username, usernameIdMap]);

  if (loading) {
    return (
      <Box maxW="600px" mx="auto" mt={5} textAlign="center">
        <Spinner size="xl" color="teal.500" />
        <Text mt={4} fontSize="lg" color="#fff">
          Loading followers...
        </Text>
      </Box>
    );
  }

  return (
    <Box maxW="600px" mx="auto" mt={5}>
      <Text
        fontSize="2xl"
        fontWeight="bold"
        mb={5}
        color="#fff"
        textAlign="center"
        borderBottom="1px solid #111"
      >
        Followers
      </Text>
      <UsersList users={followers} loading={loading} />
    </Box>
  );
};

export default FollowersPage;
