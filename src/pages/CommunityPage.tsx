import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { Activity } from "getstream";
import { toast } from "react-toastify";

import { Community } from "../contexts/CommunitiesContext";
import { JoinButton } from "../components/community";
import { useCommunities, useUser } from "../hooks";
import LoadingIndicator from "../components/LoadingIndicator";
import service from "../services/communities";
import Text from "../components/Text";
import SparkleBlock from "../components/sparkle/SparkleBlock";

export default function CommunityPage() {
  const [community, setCommunity] = useState<Community>();
  const [sparkles, setSparkles] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSparkles, setLoadingSparkles] = useState(false);
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const { communityId } = useParams();
  const { user } = useUser();
  const helper = useCommunities();

  const membersCount = community?.members.length || 0;

  useEffect(() => {
    const checkMember = (): boolean => {
      if (!user || !community) return false;
      return helper.hasMember(user._id, community._id);
    };

    const initCommunity = async () => {
      if (!communityId) return;

      setLoading(true);
      const found = helper.getCommunityById(communityId);
      if (found) setCommunity(found);
      else {
        const res = await service.getCommunity(communityId);
        if (res.ok) setCommunity(res.data as Community);
      }
      setLoading(false);
    };

    setJoined(checkMember());
    initCommunity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId]);

  useEffect(() => {
    if (!communityId) return;

    const init = async () => {
      setLoadingSparkles(true);
      try {
        const activities = (await helper.getCommunitySparkles(
          communityId
        )) as unknown as Activity[];
        setSparkles(activities);
      } catch (error) {
        console.error("Failed to fetch sparkles:", error);
        toast.error("Failed to load sparkles.");
      } finally {
        setLoadingSparkles(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId]);

  const handleJoinCommunity = async () => {
    if (!user) return toast.info("Login to join community");
    if (joined || joining || !communityId) return;
    setJoining(true);
    const res = await helper.joinCommunity(communityId);
    setJoining(false);
    if (res.ok) {
      toast.success("You are now a member");
      helper.addMember(communityId);
    } else toast.error("Could not join! Something failed");
  };

  if (loading || !community) return <LoadingIndicator />;

  return (
    <Box minH="100vh" w="100%" bg="#000" color="white" position="relative">
      <Box>
        <Image
          src={community.coverImage || require("../assets/group.jpg")}
          alt="Cover"
          w="100%"
          h="200px"
          objectFit="cover"
        />
        <Flex p={4} position="relative">
          <Image
            src={community.profileImage || require("../assets/group.jpg")}
            alt="Profile"
            boxSize="100px"
            borderRadius="50%"
            border="4px solid"
            objectFit="cover"
            borderColor="#000"
            position="absolute"
            top="-50px"
            left="16px"
          />
          <Box mt="3rem" w="100%">
            <Flex align="center" mb={3} justify="space-between">
              <Flex align="center">
                <Heading
                  size="lg"
                  color="white"
                  letterSpacing={0.2}
                  fontFamily="Quicksand"
                >
                  {community.name}
                </Heading>
                {community.isVerified && (
                  <Image
                    alt="verified"
                    src={require("../assets/verified.png")}
                    w={4}
                    h={4}
                    ml={1}
                  />
                )}
              </Flex>
              <JoinButton
                joined={joined}
                joining={joining}
                onClick={handleJoinCommunity}
              />
            </Flex>
            <Text color="gray.500">{community.bio}</Text>
            <Text color="gray.500" fontSize="sm" mt={3}>
              {membersCount} Member{membersCount === 1 ? "" : "s"}
            </Text>
          </Box>
        </Flex>
      </Box>

      <Tabs isFitted variant="unstyled" mt={4}>
        <TabList
          position="sticky"
          top="0"
          bg="#000"
          borderBottom="1px solid #38444d"
          zIndex={10}
          py={1}
          w="100%"
        >
          <Tab
            _selected={{
              color: "#1da1f2",
              borderBottom: "2px solid #1da1f2",
            }}
            _hover={{
              bg: "rgba(255, 255, 255, 0.1)",
            }}
            color="gray.300"
            fontWeight="600"
            fontFamily="Quicksand"
          >
            Sparkles
          </Tab>
          <Tab
            _selected={{
              color: "#1da1f2",
              borderBottom: "2px solid #1da1f2",
            }}
            _hover={{
              bg: "rgba(255, 255, 255, 0.1)",
            }}
            color="gray.300"
            fontWeight="600"
            fontFamily="Quicksand"
          >
            Media
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {loadingSparkles ? (
              <LoadingIndicator />
            ) : sparkles.length > 0 ? (
              sparkles.map((sparkle) => (
                <SparkleBlock activity={sparkle} key={sparkle.id} />
              ))
            ) : (
              <Text color="white">No sparkles available.</Text>
            )}
          </TabPanel>
          <TabPanel>
            {loadingSparkles ? (
              <LoadingIndicator />
            ) : sparkles.length > 0 ? (
              sparkles.map((sparkle) => (
                <SparkleBlock activity={sparkle} key={sparkle.id} showMedia />
              ))
            ) : (
              <Text color="white">No media sparkles available.</Text>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
