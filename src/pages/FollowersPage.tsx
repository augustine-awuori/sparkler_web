import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Spinner, Text } from "@chakra-ui/react";

import { User } from "../users";
import { useUsers } from "../hooks";
import usersService from "../services/users";
import UsersList from "../components/UsersList";

const FollowersPage = () => {
  const { allUsers: users } = useUsers();
  const [followers, setFollowers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { user_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const initFollowers = async () => {
      if (!user_id) return navigate(-1);

      setLoading(true);
      const res = await usersService.getUser(user_id);
      if (!res.ok) {
        toast.error("Something went wrong, try again later!");
        return navigate(-1);
      }

      const user = res.data as User;
      const followers = user.followers || {};

      setFollowers(users.filter((user) => followers[user._id]));
      setLoading(false);
    };

    initFollowers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id, users]);

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
