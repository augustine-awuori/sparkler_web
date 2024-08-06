import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Text } from "@chakra-ui/react";
import { StreamUser } from "getstream";

import { useUsers } from "../hooks";
import Layout from "../components/Layout";
import UsersList from "../components/UsersList";

const FollowingsPage = () => {
  const { client } = useStreamContext();
  const { users } = useUsers();
  const [followings, setFollowings] = useState<StreamUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { user_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getFollowings = async () => {
      const userId = users[user_id || ""];
      if (!userId) return navigate(-1);

      setLoading(true);
      const followingInfo =
        (await client?.feed("user", userId)?.following())?.results || [];

      const followingsPromises = followingInfo.map(async (following) => {
        const user = await client
          ?.user(following.target_id.replace("user:", ""))
          .get();
        return user as unknown as StreamUser;
      });

      const followings = await Promise.all(followingsPromises);
      setLoading(false);
      setFollowings(followings);
    };

    getFollowings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id, users]);

  return (
    <Layout>
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
    </Layout>
  );
};

export default FollowingsPage;
