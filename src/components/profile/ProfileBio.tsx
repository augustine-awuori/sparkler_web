import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Avatar, useStreamContext } from "react-activity-feed";
import { Box, Heading } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { FaLink, FaShare } from "react-icons/fa";
import { toast } from "react-toastify";
import styled from "styled-components";

import { appUrl } from "../../services/client";
import { Calendar, Mail } from "../../assets/icons";
import { formatStringWithLink } from "../../utils/string";
import { useProfileUser, useUser } from "../../hooks";
import FollowButton from "../FollowButton";
import SparkleShareModal from "../sparkle/SparkleShareModal";
import UserAccounts from "../UserAccounts";
import usersService from "../../services/users";

export default function ProfileBio() {
  const { client } = useStreamContext();
  const { user } = useProfileUser();
  const { user: currentUser } = useUser();
  const [showShareModal, setShowShareModal] = useState(false);
  const navigate = useNavigate();
  const { username } = useParams();

  useEffect(() => {
    async function updateBio() {
      if (client?.userId !== user.id) return;
      const bio = user.data.bio;

      if (bio && !currentUser?.bio) await usersService.updateUserInfo({ bio });
    }

    updateBio();
  }, [client?.userId, currentUser?.bio, user.data.bio, user.id]);

  const actions = [
    {
      Icon: Mail,
      id: "message",
      onClick: startDM,
    },
  ];

  const followersCount = user.followers_count || 0;
  const followingCount = user.following_count || 0;

  function startDM() {
    currentUser
      ? navigate(`/messages?${user.id}`)
      : toast.info("Login to send message");
  }

  const joinedDate = format(
    new Date(user?.created_at || Date.now()),
    "MMMM yyyy"
  );

  const isLoggedInUserProfile = user?.id === client?.userId;

  if (!user) return <Heading>Profile user info is not available</Heading>;

  const formattedBio = formatStringWithLink(user.data.bio || "");

  return (
    <Container>
      <TopSection>
        <ProfileImage>
          <Avatar image={user.data.profileImage} alt="profile" />
        </ProfileImage>
        <ActionsContainer>
          <ActionButton onClick={() => setShowShareModal(true)}>
            <FaShare size={15} />
          </ActionButton>
          {actions.map((action) => (
            <ActionButton key={action.id} onClick={action.onClick}>
              <action.Icon size={21} color="#fff" />
            </ActionButton>
          ))}
          <FollowButtonWrapper>
            <FollowButton userId={user?.id || ""} />
          </FollowButtonWrapper>
        </ActionsContainer>
      </TopSection>

      <Details>
        <UserName>
          {user.data?.name}
          {user.data?.verified && (
            <VerifiedIcon
              src={
                user.data?.isAdmin
                  ? require("../../assets/admin.png")
                  : require("../../assets/verified.png")
              }
              alt="Verified"
            />
          )}
        </UserName>
        <UserId>@{username}</UserId>
        <UserBio dangerouslySetInnerHTML={{ __html: formattedBio }} />
        {user.data.customLink && (
          <CustomLinkWrapper>
            <CustomLink
              href={user.data.customLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLink className="link-icon" size={16} />
              <span>{user.data.customLink.replace("https://", "")}</span>
            </CustomLink>
          </CustomLinkWrapper>
        )}
        <UserJoined>
          <Calendar color="#777" size={20} />
          <span>Joined {joinedDate}</span>
        </UserJoined>
        <UserFollows>
          <FollowCount onClick={() => navigate("followings")}>
            <b>{followingCount}</b> Following
          </FollowCount>
          <FollowCount onClick={() => navigate("followers")}>
            <b>{followersCount}</b> Follower{followersCount === 1 ? "" : "s"}
          </FollowCount>
        </UserFollows>
        {!isLoggedInUserProfile && (
          <UserFollowedBy>
            Not followed by anyone you are following
          </UserFollowedBy>
        )}
        <UserAccounts user={user} />
      </Details>
      <SparkleShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        sparkleUrl={`${appUrl}/${username}`}
        text={`${user.data.name} @${username} "${user.data.bio}" followers: ${followersCount} following: ${followingCount}`}
        title="Profile"
      />
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  position: relative;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: -50px;
`;

const ProfileImage = styled.figure`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid black;
  background-color: #444;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  top: 60px;
`;

const ActionButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #777;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const FollowButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Details = styled.div`
  color: #888;
  margin-top: 20px;
`;

const UserName = styled.span`
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
`;

const VerifiedIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 5px;
`;

const UserId = styled.span`
  display: block;
  margin-top: 2px;
`;

const UserBio = styled.span`
  color: white;
  margin-top: 10px;
  display: block;

  a {
    color: var(--primary-color);
    text-decoration: none;
  }
`;

const CustomLinkWrapper = styled.div`
  margin-top: 7px;
`;

const CustomLink = styled.a`
  display: inline-flex;
  align-items: center;
  background-color: var(--primary-color);
  color: white;
  padding: 8px 12px;
  border-radius: 30px;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.3s ease, transform 0.3s ease;

  .link-icon {
    margin-right: 8px;
  }

  &:hover {
    background-color: var(--primary-hover-color);
    transform: translateY(-2px);
  }

  &:active {
    background-color: var(--primary-color);
    transform: translateY(0);
  }
`;

const UserJoined = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
  font-size: 15px;

  span {
    margin-left: 5px;
  }
`;

const UserFollows = styled.div`
  font-size: 15px;
  display: flex;
  margin-top: 15px;
`;

const FollowCount = styled(Box)`
  cursor: pointer;

  &:not(:last-child) {
    margin-right: 20px;
  }

  b {
    color: white;
  }
`;

const UserFollowedBy = styled.div`
  margin-top: 10px;
`;
