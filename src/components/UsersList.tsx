import { StreamUser } from "getstream";
import { Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { ActivityActor } from "../utils/types";
import Avatar from "./Avatar";
import FollowBtn from "./FollowBtn";
import LoadingIndicator from "./LoadingIndicator";

interface Props {
  loading: boolean;
  users: StreamUser[];
}

const UsersList = ({ loading, users }: Props) => {
  const navigate = useNavigate();

  if (loading) return <LoadingIndicator />;

  return (
    <div>
      {users.map((user) => {
        const { profileImage, name, username, id, bio } = (
          user as unknown as ActivityActor
        ).data;

        return (
          <Flex
            key={user.id}
            p={3}
            borderBottom="1px"
            borderColor="#777"
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
    </div>
  );
};

export default UsersList;
