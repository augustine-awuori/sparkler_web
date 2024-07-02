import classNames from "classnames";
import styled from "styled-components";

import { useFollow } from "../hooks";

const Container = styled.div`
  button {
    background-color: #1da1f2; /* Twitter blue */
    color: white;
    border: none;
    border-radius: 18px; /* Adjusted for a smaller button */
    padding: 6px 12px; /* Reduced padding */
    font-size: 13px; /* Reduced font size */
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease, border-color 0.3s ease,
      color 0.3s ease;

    &.following {
      background-color: white;
      color: #1da1f2;
      border: 1px solid #1da1f2;
    }

    &:hover {
      background-color: #1991da;
    }

    &.following:hover {
      background-color: #ff4d4d;
      color: white;
      border: 1px solid #ff4d4d;
    }

    .follow-text {
      position: relative;
      .follow-text__following {
        display: inline-block;
      }
      .follow-text__unfollow {
        display: none;
      }
    }

    &.following .follow-text:hover .follow-text__following {
      display: none;
    }

    &.following .follow-text:hover .follow-text__unfollow {
      display: inline-block;
    }
  }
`;

export default function FollowBtn({ userId }: { userId: string }) {
  const { isFollowing, toggleFollow } = useFollow({ userId });

  return (
    <Container>
      <button
        className={classNames(isFollowing ? "following" : "not-following")}
        onClick={toggleFollow}
      >
        {isFollowing ? (
          <div className="follow-text">
            <span className="follow-text__following">Following</span>
            <span className="follow-text__unfollow">Unfollow</span>
          </div>
        ) : (
          "Follow"
        )}
      </button>
    </Container>
  );
}
