import { useEffect, useState } from "react";
import { Avatar, useStreamContext } from "react-activity-feed";
import { Spinner, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useProfile } from "../../hooks";
import { User } from "../../users";
import FollowBtn from "../FollowBtn";
import usersService from "../../services/users";
import verificationIcon from "../../assets/verified.svg"; // Import the verification icon

interface Props {
  query: string;
}

const ANONYMOUS_USER_ID = "6685aed25e91a51c0361251f";

const WhoToFollow = ({ query }: Props) => {
  const { client } = useStreamContext();
  const [isLoading, setIsLoading] = useState(false);
  const [leaderSuggestions, setLeadersSuggestions] = useState<User[]>([]);
  const navigate = useNavigate();
  const { setUser } = useProfile();

  useEffect(() => {
    getAllUsers();
  }, []);

  async function getAllUsers() {
    setIsLoading(true);
    const res = await usersService.getAllUsers();
    setIsLoading(false);

    if (res.ok) setLeadersSuggestions(res.data as User[]);
  }

  const navigateToProfile = (leader: User) => {
    navigate(`/${leader.username}`);
    setUser({
      created_at: "",
      id: leader._id,
      updated_at: "",
      duration: "",
      data: leader,
    });
  };

  const leaders = query
    ? leaderSuggestions.filter(
        ({ name, username }) =>
          name.toLowerCase().includes(query.toLowerCase()) ||
          username.toLowerCase().includes(query.toLowerCase())
      )
    : leaderSuggestions;

  return (
    <FollowsContainer>
      <h2>Who to follow</h2>

      {isLoading && (
        <div className="flex justify-center">
          <Spinner size="md" color="teal.500" />
        </div>
      )}

      {!isLoading && leaders.length === 0 && query && (
        <p className="no-results-text">No results</p>
      )}

      <div className="follows-list">
        {leaders
          .filter((user) => user._id !== client?.userId)
          .filter((user) => user._id !== ANONYMOUS_USER_ID)
          .map((leader) => (
            <div className="user" key={leader._id}>
              <div
                onClick={() => navigateToProfile(leader)}
                className="user__details"
              >
                <div className="user__img">
                  <Avatar image={leader.profileImage} />
                </div>
                <div className="user__info">
                  <Text noOfLines={1} className="user__name">
                    {leader.name}
                    {leader.verified && (
                      <img
                        src={verificationIcon}
                        alt="Verified"
                        className="verified-icon"
                      />
                    )}
                  </Text>
                  <span className="user__id">@{leader.username}</span>
                </div>
              </div>
              <FollowBtn userId={leader._id} />
            </div>
          ))}
      </div>

      {/* Show more link */}
      <span className="show-more-text">Show more</span>
    </FollowsContainer>
  );
};

const FollowsContainer = styled.div`
  background-color: #1c1f24;
  border-radius: 16px;
  padding: 16px;
  width: 100%;

  h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
    text-align: center;
    color: #fff;
  }

  .user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 5px 8px;
    border-radius: 8px;
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
      background-color: #2a2f35;
      transform: scale(1.02);
    }

    .user__details {
      display: flex;
      align-items: center;
      flex-grow: 1; /* Make the details container take up available space */
      min-width: 0; /* Prevent overflow issues */

      .user__img {
        min-width: 40px;
        min-height: 40px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 8px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .user__info {
        max-width: 100%; /* Make the user info container grow */
        flex-grow: 1;
        min-width: 0; /* Prevent overflow issues */

        .user__name {
          font-size: 16px;
          font-weight: bold;
          color: #fff;
          display: flex;
          align-items: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          .verified-icon {
            width: 16px; /* Adjust icon size */
            height: 16px;
            margin-left: 5px;
            flex-shrink: 0; /* Prevent icon from shrinking */
          }
        }

        .user__id {
          font-size: 12px;
          color: #657786;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
      }
    }

    /* Ensure the button stays in place */
    .follow-btn {
      flex-shrink: 0; /* Prevent the button from shrinking */
    }
  }

  .no-results-text {
    color: #657786;
    text-align: center;
    margin-top: 16px;
  }

  .show-more-text {
    color: #1da1f2;
    cursor: pointer;
    display: block;
    text-align: center;
    margin-top: 16px;
  }
`;

export default WhoToFollow;
