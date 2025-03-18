import React from "react";
import styled, { keyframes } from "styled-components";

import { useFollow, useUser } from "../hooks";

export default function FollowButton({ userId }: { userId: string }) {
  const { isFollowing, toggleFollow, loading } = useFollow({ userId });
  const { user } = useUser();

  const handleToggle = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    toggleFollow();
  };

  const isCurrentUser = user?._id === userId;

  return (
    <Container>
      {isCurrentUser ? (
        <StyledButton $isFollowing={false}>Edit Profile</StyledButton>
      ) : (
        <StyledButton
          onClick={handleToggle}
          disabled={loading}
          $isFollowing={isFollowing}
        >
          {loading ? (
            <Spinner />
          ) : isFollowing ? (
            <FollowText>
              <span className="follow-text__following">Following</span>
              <span className="follow-text__unfollow">Unfollow</span>
            </FollowText>
          ) : (
            "Follow"
          )}
        </StyledButton>
      )}
    </Container>
  );
}

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const StyledButton = styled.button<{ $isFollowing: boolean }>`
  padding: 6px 16px;
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 9999px; /* X.com's pill-shaped buttons */
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--primary-hover-color);
    color: var(--text-color);
    border-color: var(--primary-hover-color);
  }

  ${({ $isFollowing }) =>
    $isFollowing &&
    `
    background-color: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);

    &:hover {
      background-color: #ff4d4d; /* Red hover for unfollow */
      color: var(--text-color);
      border-color: #ff4d4d;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

  &:hover .follow-text .follow-text__following {
    display: none;
  }

  &:hover .follow-text .follow-text__unfollow {
    display: inline-block;
  }
`;

const FollowText = styled.div`
  display: flex;
  align-items: center;
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(29, 161, 242, 0.6); /* Match --primary-color */
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: ${spinAnimation} 0.6s linear infinite;
`;
