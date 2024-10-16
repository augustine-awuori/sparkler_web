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
import { toast } from "react-toastify";

import { User } from "../users";
import { useUsers } from "../hooks";
import UsersList from "../components/UsersList";
import usersService from "../services/users";

const FollowingsPage = () => {
  const { allUsers: users } = useUsers();
  const [followings, setFollowings] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { user_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getFollowings = async () => {
      if (!user_id) return navigate(-1);

      setLoading(true);
      const res = await usersService.getUser(user_id);
      if (!res.ok) {
        toast.error("Something went wrong, try again later!");
        setError(true);
        return navigate(-1);
      }

      const user = res.data as User;
      const following = user.following || {};

      setFollowings(users.filter((user) => following[user._id]));
      setLoading(false);
    };

    window.scroll(0, 0);

    getFollowings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id, users]);

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
