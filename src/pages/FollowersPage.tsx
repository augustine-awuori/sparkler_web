import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { StreamUser } from "getstream";

import { useUsers } from "../hooks";
import Layout from "../components/Layout";
import { ActivityActor } from "../utils/types";
import FollowBtn from "../components/FollowBtn";
import Avatar from "../components/Avatar";

const FollowersPage = () => {
  const { client } = useStreamContext();
  const { users } = useUsers();
  const [followers, setFollowers] = useState<StreamUser[]>([]);
  const { user_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getFollowers = async () => {
      const userId = users[user_id || ""];
      if (!userId) return navigate(-1);

      const followersInfo =
        (await client?.feed("user", userId)?.followers())?.results || [];

      const followersPromises = followersInfo.map(async (follower) => {
        const user = await client
          ?.user(follower.feed_id.replace("timeline:", ""))
          .get();
        return user as unknown as StreamUser;
      });

      const followers = await Promise.all(followersPromises);
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
        >
          Followers
        </Text>
        {followers.map((follower) => {
          const { profileImage, name, username, id, bio } = (
            follower as unknown as ActivityActor
          ).data;

          return (
            <Flex
              key={follower.id}
              p={3}
              borderBottom="1px"
              borderColor="gray.200"
              onClick={() => navigate(`/${username}`)}
              cursor="pointer"
            >
              <Avatar
                mr={3}
                name={name}
                src={profileImage}
                w={50}
                h={50}
                borderRadius="full"
              />
              <Flex flex="1" direction="column" justify="center">
                <Text fontWeight="bold" fontSize="md" color="#ccc">
                  {name}
                </Text>
                <Text fontSize="sm" color="var(--theme-color)">
                  @{username}
                </Text>
                <Text mt={2} fontSize="sm" noOfLines={2} color="#777">
                  {bio}
                </Text>
              </Flex>
              <FollowBtn userId={id} />
            </Flex>
          );
        })}
      </Box>
    </Layout>
  );
};

export default FollowersPage;
