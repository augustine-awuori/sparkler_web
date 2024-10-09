import { Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "react-activity-feed";

import { User } from "../users";
import { useUser } from "../hooks";
import FollowBtn from "./FollowBtn";
import LoadingIndicator from "./LoadingIndicator";

interface Props {
  loading: boolean;
  users: User[];
}

const UsersList = ({ loading, users }: Props) => {
  const navigate = useNavigate();
  const { user: currentUser } = useUser();

  if (loading) return <LoadingIndicator />;

  if (!users.length) {
    return (
      <Flex justify="center" align="center" p={5}>
        <Text fontSize="lg" color="#777">
          No users found. Check back later!
        </Text>
      </Flex>
    );
  }

  return (
    <div>
      {users.map((user) => {
        const { profileImage, name, username, _id } = user;

        return (
          <Flex
            key={user._id}
            p={3}
            borderBottom="1px"
            borderColor="#777"
            onClick={() => navigate(`/${username}`)}
            cursor="pointer"
          >
            <Avatar
              circle
              image={profileImage}
              style={{
                marginRight: 5,
                width: 50,
                height: 50,
                borderRadius: 25,
              }}
            />

            <Flex flex="1" direction="column" justify="center">
              <Text fontWeight="bold" fontSize="md" color="#ccc">
                {name}
              </Text>
              <Text fontSize="sm" color="var(--theme-color)">
                @{username}
              </Text>
              {/* <Text mt={2} fontSize="sm" noOfLines={2} color="#777">
                {bio}
              </Text> */}
            </Flex>
            {_id !== currentUser?._id && <FollowBtn userId={_id} />}
          </Flex>
        );
      })}
    </div>
  );
};

export default UsersList;
