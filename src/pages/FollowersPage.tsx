import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Text } from "@chakra-ui/react";
import { StreamUser } from "getstream";

import { useUsers } from "../hooks";
import Layout from "../components/Layout";
import UsersList from "../components/UsersList";

const FollowersPage = () => {
  const { client } = useStreamContext();
  const { users } = useUsers();
  const [followers, setFollowers] = useState<StreamUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { user_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getFollowers = async () => {
      const userId = users[user_id || ""];
      if (!userId) return navigate(-1);

      setLoading(true);
      const followersInfo =
        (await client?.feed("user", userId)?.followers())?.results || [];

      const followersPromises = followersInfo.map(async (follower) => {
        const user = await client
          ?.user(follower.feed_id.replace("timeline:", ""))
          .get();
        return user as unknown as StreamUser;
      });

      const followers = await Promise.all(followersPromises);
      setLoading(false);
      setFollowers(followers);
    };

    getFollowers();
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
          borderBottom="1px solid #111"
        >
          Followers
        </Text>
        <UsersList users={followers} loading={loading} />
      </Box>
    </Layout>
  );
};

export default FollowersPage;
