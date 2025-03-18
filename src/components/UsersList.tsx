import { Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "react-activity-feed";
import styled from "styled-components";

import { User } from "../users";
import FollowButton from "./FollowButton";
import LoadingIndicator from "./LoadingIndicator";

interface Props {
  loading: boolean;
  users: User[];
}

const UsersList = ({ loading, users }: Props) => {
  const navigate = useNavigate();

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
    <Container>
      {users.map((user) => {
        const { bio, profileImage, name, username, _id, verified, isAdmin } =
          user;

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
              <Flex align="center">
                <Text fontWeight="bold" fontSize="md" color="#ccc">
                  {name}
                </Text>
                {verified && (
                  <img
                    src={
                      isAdmin
                        ? require("../assets/admin.png")
                        : require("../assets/verified.png")
                    }
                    alt="Verified"
                    className="verified-icon"
                  />
                )}
              </Flex>
              <Text fontSize="sm" color="var(--theme-color)">
                @{username}
              </Text>
              {bio && (
                <Text mt={2} fontSize="sm" noOfLines={2} color="#777">
                  {bio}
                </Text>
              )}
            </Flex>
            <FollowButton userId={_id} />
          </Flex>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  .verified-icon {
    width: 16px;
    height: 16px;
    margin-left: 5px;
    flex-shrink: 0;
  }
`;

export default UsersList;
