import { useEffect, useState } from "react";
import { Avatar, useStreamContext } from "react-activity-feed";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { User } from "../../users";
import FollowBtn from "../FollowBtn";
import usersService from "../../services/users";

const WhoToFollow = () => {
  const { client } = useStreamContext();
  const [leaderSuggestions, setLeadersSuggestions] = useState<User[]>([]);

  useEffect(() => {
    getAllUsers();
  }, []);

  async function getAllUsers() {
    const res = await usersService.getAllUsers();
    if (res.ok) setLeadersSuggestions(res.data as User[]);
  }

  return (
    <FollowsContainer>
      <h2>Who to follow</h2>

      <div className="follows-list">
        {leaderSuggestions
          .filter((user) => user._id !== client?.userId)
          .map((leader) => (
            <Link to={`/${leader.username}`} className="user" key={leader._id}>
              <div className="user__details">
                <div className="user__img">
                  {leader.avatar ? (
                    <img src={leader.avatar} alt="" />
                  ) : (
                    <Avatar />
                  )}
                </div>
                <div className="user__info">
                  <span className="user__name">{leader.name}</span>
                  <span className="user__id">@{leader.username}</span>
                </div>
              </div>
              <FollowBtn userId={leader._id} />
            </Link>
          ))}
      </div>
      <span className="show-more-text">Show more</span>
    </FollowsContainer>
  );
};

const FollowsContainer = styled.div`
  background-color: #1c1f24; /* Dark background */
  border-radius: 16px;
  padding: 16px;
  width: 100%; /* Make the follows container full width */

  h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
    color: #fff; /* Header text color */
  }

  .user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 5px 8px;
    border-radius: 8px; /* Rounded corners for hover effect */
    transition: background-color 0.3s, transform 0.3s; /* Smooth transition */

    &:hover {
      background-color: #2a2f35; /* Darker background on hover */
      transform: scale(1.02); /* Slightly enlarge the user card */
    }

    .user__details {
      display: flex;
      align-items: center;

      .user__img {
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
          color: #fff; /* Text color */
        }

        .user__id {
          font-size: 12px;
          color: #657786;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100px; /* Adjust the width as needed */
        }
      }
    }
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
