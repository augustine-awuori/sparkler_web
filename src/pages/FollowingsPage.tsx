import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
} from "@chakra-ui/react";

import { FollowersResult } from "../utils/types";
import { User } from "../users";
import { useUsers } from "../hooks";
import UsersList from "../components/UsersList";
import usersService from "../services/users";

const FollowingsPage = () => {
  const [followings, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { idUserMap, usernameIdMap } = useUsers();
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadFollowers = async () => {
      if (!username) return;

      const userId = usernameIdMap[username];
      if (!userId) return;

      setLoading(true);
      const res = await usersService.getUserFollowing(userId);

      if (res.ok)
        setFollowing(
          (res.data as FollowersResult)
            .map(({ target_id }) => {
              return idUserMap[target_id.replace("user:", "")];
            })
            .filter((user) => user?._id)
        );
      else setError(!res.ok);
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
          Loading followings...
        </Text>
      </Box>
    );
  }

  if (error || !followings.length) {
    return (
      <Box maxW="600px" mx="auto" mt={5} textAlign="center">
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>
              Unable to load followings. Please try again later.
            </AlertDescription>
          </Box>
        </Alert>
        <Button mt={4} colorScheme="teal" onClick={() => navigate(-1)}>
          Go Back
        </Button>
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
      >
        Followings
      </Text>
      <UsersList users={followings} loading={loading} />
    </Box>
  );
};

export default FollowingsPage;
