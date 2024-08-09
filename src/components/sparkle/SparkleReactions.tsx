import React, { useRef } from "react";
import { Activity } from "getstream";
import classNames from "classnames";

import { useLike, useSparkle } from "../../hooks";
import { Activity as AppActivity } from "../../utils/types";
import Retweet from "../icons/Retweet";
import Heart from "../icons/Heart";
import Upload from "../icons/Upload";
import Comment from "../icons/Comment";
import styled from "styled-components";

interface Props {
  appActivity: AppActivity;
  setPopupPosition: React.Dispatch<
    React.SetStateAction<{ top: number; left: number }>
  >;
  onCommentDialogOpen: (value: boolean) => void;
  onResparkleDialogSwitch: () => void;
}

const SparkleReactions = ({
  appActivity,
  onCommentDialogOpen,
  onResparkleDialogSwitch,
  setPopupPosition,
}: Props) => {
  const { toggleLike } = useLike();
  const { checkIfHasLiked, checkIfHasResparkled } = useSparkle();
  const resparkleButtonRef = useRef<HTMLButtonElement>(null);

  const hasResparkled = checkIfHasResparkled(appActivity);
  const hasLikedSparkle = checkIfHasLiked(appActivity);

  const actions = [
    {
      id: "comment",
      Icon: Comment,
      alt: "Comment",
      value: appActivity?.reaction_counts?.comment || 0,
      onClick: () => onCommentDialogOpen(true),
    },
    {
      id: "resparkle",
      Icon: Retweet,
      alt: "Resparkle",
      value: appActivity.reaction_counts.resparkle || 0,
      onClick: (_e: React.MouseEvent<HTMLButtonElement>) => {
        const buttonRect = resparkleButtonRef.current!.getBoundingClientRect();
        setPopupPosition({
          top: buttonRect.top - 10,
          left: buttonRect.left,
        });

        onResparkleDialogSwitch();
      },
    },
    {
      id: "heart",
      Icon: Heart,
      alt: "Heart",
      value: appActivity?.reaction_counts?.like || 0,
      onClick: onToggleLike,
    },
    {
      id: "upload",
      Icon: Upload,
      alt: "Upload",
    },
  ];

  function onToggleLike() {
    return toggleLike(appActivity as unknown as Activity, hasLikedSparkle);
  }

  const getColor = (name: string) => {
    if (name === "heart")
      return hasLikedSparkle ? "var(--theme-color)" : "#777";
    else if (name === "resparkle") return hasResparkled ? "#17BF63" : "#777";
    return "#777";
  };

  return (
    <Container onClick={console.log}>
      {actions.map((action) => {
        return (
          <button
            ref={action.id === "resparkle" ? resparkleButtonRef : null}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick?.(e);
            }}
            key={action.id}
            type="button"
          >
            <action.Icon
              color={getColor(action.id)}
              size={17}
              fill={action.id === "heart" && hasLikedSparkle}
            />
            <span
              className={classNames("value", {
                colored:
                  (action.id === "heart" && hasLikedSparkle) ||
                  (action.id === "resparkle" && hasResparkled),
                green: action.id === "resparkle" && hasResparkled,
              })}
            >
              {action.value}
            </span>
          </button>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5px;

  button {
    display: flex;
    align-items: center;
  }

  .value {
    margin-left: 10px;
    color: #666;

    &.colored {
      color: var(--theme-color);
    }

    &.green {
      color: #17bf63;
    }
  }
`;

export default SparkleReactions;
