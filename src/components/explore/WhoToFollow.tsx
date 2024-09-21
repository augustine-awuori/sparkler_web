import { useEffect, useState } from "react";
import { Avatar, useStreamContext } from "react-activity-feed";
import { Spinner, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { User } from "../../users";
import FollowBtn from "../FollowBtn";
import usersService from "../../services/users";

interface Props {
  query: string;
}

const WhoToFollow = ({ query }: Props) => {
  const { client } = useStreamContext();
  const [isLoading, setIsLoading] = useState(false);
  const [leaderSuggestions, setLeadersSuggestions] = useState<User[]>([]);

  useEffect(() => {
    getAllUsers();
  }, []);

  async function getAllUsers() {
    setIsLoading(true);
    const res = await usersService.getAllUsers();
    setIsLoading(false);

    if (res.ok) setLeadersSuggestions(res.data as User[]);
  }

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

      {/* Spinner while loading */}
      {isLoading && (
        <div className="flex justify-center">
          <Spinner size="md" color="teal.500" />
        </div>
      )}

      {/* No results text if no users match the query */}
      {!isLoading && leaders.length === 0 && query && (
        <p className="no-results-text">No results</p>
      )}

      <div className="follows-list">
        {leaders
          .filter((user) => user._id !== client?.userId)
          .map((leader) => (
            <Link to={`/${leader.username}`} className="user" key={leader._id}>
              <div className="user__details">
                <div className="user__img">
                  {leader.profileImage ? (
                    <img src={leader.profileImage} alt="" />
                  ) : (
                    <Avatar />
                  )}
                </div>
                <div className="user__info">
                  <Text noOfLines={1} className="user__name">
                    {leader.name}
                  </Text>
                  <span className="user__id">@{leader.username}</span>
                </div>
              </div>
              <FollowBtn userId={leader._id} />
            </Link>
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
        .user__name {
          font-size: 16px;
          font-weight: bold;
          color: #fff;
        }

        .user__id {
          font-size: 12px;
          color: #657786;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100px;
        }
      }
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
