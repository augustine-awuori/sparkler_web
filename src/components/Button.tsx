import React from "react";
import classNames from "classnames";
import styled from "styled-components";

type OutlineState = {
  outline: boolean;
  outlineText: string;
  blockText?: string;
};

type BlockState = {
  outline: boolean;
  outlineText?: string;
  blockText: string;
};

type AllState = {
  outline: boolean;
  outlineText: string;
  blockText: string;
};

type State = AllState | BlockState | OutlineState;

interface Props {
  onClick: () => void;
}

const Button: React.FC<State & Props> = ({
  outline,
  blockText,
  outlineText,
  onClick,
}) => (
  <Container onClick={onClick}>
    <button className={classNames(outline ? "outline" : "block")}>
      <div className="follow-text">
        <span
          className={`follow-text${outline ? "__following" : "__unfollow"}`}
        >
          {outline ? outlineText : blockText}
        </span>
      </div>
    </button>
  </Container>
);

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

    &.outline {
      background-color: white;
      color: var(--theme-color);
      border: 1px solid var(--theme-color);
    }

    &:hover {
      background-color: var(--conc-theme-color);
    }

    &.outline:hover {
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

    &.outline .follow-text:hover .follow-text__following {
      display: none;
    }

    &.outline .follow-text:hover .follow-text__unfollow {
      display: inline-block;
    }
  }
`;

export default Button;
