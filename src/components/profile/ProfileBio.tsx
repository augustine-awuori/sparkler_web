import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Avatar, useStreamContext } from "react-activity-feed";
import { Box, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaShare } from "react-icons/fa";
import { toast } from "react-toastify";
import styled from "styled-components";

import { appUrl } from "../../services/client";
import { Calendar, Mail } from "../../assets/icons";
import { formatStringWithLink } from "../../utils/string";
import { useProfile, useUser } from "../../hooks";
import EditProfileButton from "../profile/EditProfileButton";
import FollowBtn from "../FollowBtn";
import usersService from "../../services/users";
import verificationIcon from "../../assets/verified.svg";
import SparkleShareModal from "../sparkle/SparkleShareModal";

export default function ProfileBio() {
  const { client } = useStreamContext();
  const { user } = useProfile();
  const { user: currentUser } = useUser();
  const [showShareModal, setShowShareModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function updateBio() {
      if (client?.userId !== user.id) return;

      const bio = user.data.bio;

      if (bio && !currentUser?.bio) await usersService.updateUserInfo({ bio });
    }

    updateBio();
  }, [client?.userId, currentUser?.bio, user.data.bio, user.id]);

  const actions = [
    // {
    //   Icon: More,
    //   id: "more",
    //   onClick: () => {},
    // },
    {
      Icon: Mail,
      id: "message",
      onClick: startDM,
    },
  ];

  const followersCount: number = user.followers_count || 0;
  const followingCount: number = user.following_count || 0;

  function startDM() {
    currentUser
      ? navigate(`/messages?${user.id}`)
      : toast.info("Login to send message");
  }

  const joinedDate = format(
    new Date(user?.created_at || Date.now()),
    "MMMM RRRR"
  );

  const isLoggedInUserProfile = user?.id === client?.userId;

  if (!user) return <Heading>Profile user info is not available</Heading>;

  const formattedBio = formatStringWithLink(user.data.bio || "");

  return (
    <Container>
      <div className="top">
        <figure className="image">
          <Avatar image={user.data.profileImage} alt="profile" />
        </figure>
        <div className="actions">
          <button
            className="action-btn"
            onClick={() => setShowShareModal(true)}
          >
            <FaShare color="white" size={15} />
          </button>
          {isLoggedInUserProfile ? (
            <EditProfileButton />
          ) : (
            <>
              {actions.map((action) => (
                <button
                  className="action-btn"
                  key={action.id}
                  onClick={action.onClick}
                >
                  <action.Icon color="white" size={21} />
                </button>
              ))}
              {user?.id && <FollowBtn userId={user.id} />}
            </>
          )}
        </div>
      </div>
      <div className="details">
        <span className="user__name">
          {user.data?.name as string}
          {user.data?.verified && (
            <img
              src={verificationIcon}
              alt="Verified"
              className="verified-icon"
            />
          )}
        </span>
        <span className="user__id">@{user?.data?.username as string}</span>
        <span
          className="user__bio"
          dangerouslySetInnerHTML={{ __html: formattedBio }}
        />
        <div className="user__joined">
          <Calendar color="#777" size={20} />
          <span className="user__joined--text">Joined {joinedDate}</span>
        </div>
        <div className="user__follows">
          <Box
            cursor="pointer"
            onClick={() => {
              if (followingCount) navigate("followings");
            }}
            className="user__follows__following"
          >
            <b>{followingCount}</b> Following
          </Box>
          <Box
            cursor="pointer"
            className="user__follows__followers"
            onClick={() => {
              if (followersCount) navigate("followers");
            }}
          >
            <b>{followersCount || 0}</b> Follower
            {followersCount === 1 ? "" : "s"}
          </Box>
        </div>
        {!isLoggedInUserProfile && (
          <div className="user__followed-by">
            Not followed by anyone you are following
          </div>
        )}
      </div>
      <SparkleShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        sparkleUrl={`${appUrl}/${user.data.username}`}
        text={`${user.data.name} @${user.data.username} "${user.data.bio}" followers: ${followersCount} following: ${followingCount}`}
        title="Profile"
      />
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  position: relative;

  .top {
    display: flex;
    justify-content: space-between;
    margin-top: calc(var(--profile-image-size) / -1.5);

    .image {
      width: var(--profile-image-size);
      height: var(--profile-image-size);
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid black;
      background-color: #444;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .actions {
      position: relative;
      top: 55px;
      display: flex;

      .action-btn {
        border: 1px solid #777;
        margin-right: 10px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .details {
    color: #888;
    margin-top: 20px;

    .user {
      &__name {
        color: white;
        font-weight: bold;
        display: flex;
        align-items: center;

        .verified-icon {
          width: 16px; /* Adjust icon size */
          height: 16px;
          margin-left: 5px;
        }
      }

      &__id {
        margin-top: 2px;
        font-size: 15px;
      }

      &__bio {
        color: white;
        margin-top: 10px;
        a {
          color: var(--theme-color);
          text-decoration: none;
        }
      }

      &__joined {
        display: flex;
        align-items: center;
        margin-top: 15px;
        font-size: 15px;

        &--text {
          margin-left: 5px;
        }
      }

      &__follows {
        font-size: 15px;
        display: flex;
        margin-top: 15px;

        b {
          color: white;
        }

        &__followers {
          margin-left: 20px;
        }
      }

      &__followed-by {
        font-size: 13px;
        margin-top: 15px;
      }
    }
  }
`;
