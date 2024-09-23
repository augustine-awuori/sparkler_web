import React from "react";
import classNames from "classnames";
import styled from "styled-components";

import { useFollow, useUser } from "../hooks";

export default function FollowBtn({ userId }: { userId: string }) {
  const { isFollowing, toggleFollow } = useFollow({ userId });
  const { user } = useUser();

  const handleToggle = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    toggleFollow();
  };

  const validFollowing = Boolean(isFollowing && user);

  return (
    <Container>
      <button
        className={classNames(validFollowing ? "following" : "not-following")}
        onClick={handleToggle}
      >
        {validFollowing ? (
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

const Container = styled.div`
  button {
    background-color: var(--theme-color);
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
      color: var(--theme-color);
      border: 1px solid var(--theme-color);
    }

    &:hover {
      background-color: var(--conc-theme-color);
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
