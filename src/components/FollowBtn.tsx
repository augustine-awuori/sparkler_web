import React from "react";
import classNames from "classnames";
import styled, { keyframes } from "styled-components";

import { useFollow, useUser } from "../hooks";

export default function FollowBtn({ userId }: { userId: string }) {
  const { isFollowing, toggleFollow, loading } = useFollow({ userId });
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
        disabled={loading}
      >
        {loading ? (
          <div className="spinner" />
        ) : validFollowing ? (
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

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div`
  button {
    background-color: var(--theme-color);
    color: white;
    border: none;
    border-radius: 18px;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    transition: background-color 0.3s ease, border-color 0.3s ease,
      color 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;

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

    /* Spinner styling */
    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.6);
      border-top-color: white;
      border-radius: 50%;
      animation: ${spinAnimation} 0.6s linear infinite;
    }
  }
`;
