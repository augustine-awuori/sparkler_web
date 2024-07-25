import React, { useState, useRef } from "react";
import { useStreamContext } from "react-activity-feed";
import { Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import classNames from "classnames";
import { Activity } from "getstream";

import { Activity as AppActivity, ActivityObject } from "../../utils/types";
import { formatStringWithLink } from "../../utils/string";
import { generateSparkleLink } from "../../utils/links";
import { useComment, useLike } from "../../hooks";
import Comment from "../icons/Comment";
import CommentDialog from "./CommentDialog ";
import Heart from "../icons/Heart";
import More from "../icons/More";
import ResparklePopup from "./ResparklePopup";
import Retweet from "../icons/Retweet";
import TweetActorName from "./SparkleActorName";
import Upload from "../icons/Upload";

interface Props {
  activity: Activity;
}

const SparkleBlock: React.FC<Props> = ({ activity }) => {
  const { user } = useStreamContext();
  const { toggleLike } = useLike();
  const { createComment } = useComment();
  const navigate = useNavigate();
  const [commentDialogOpened, setCommentDialogOpened] = useState(false);
  const [retweetPopupOpened, setResparklePopupOpened] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const retweetButtonRef = useRef<HTMLButtonElement>(null);

  const appActivity = activity as unknown as AppActivity;
  const actor = appActivity.actor;
  let hasLikedSparkle = false;
  const tweet = (activity.object as unknown as ActivityObject).data;

  if (appActivity?.own_reactions?.like && user) {
    const myReaction = appActivity.own_reactions.like.find(
      (l) => l.user.id === user?.id
    );
    hasLikedSparkle = Boolean(myReaction);
  }

  const onToggleLike = () => toggleLike(activity, hasLikedSparkle);

  const actions = [
    {
      id: "comment",
      Icon: Comment,
      alt: "Comment",
      value: appActivity?.reaction_counts?.comment || 0,
      onClick: () => setCommentDialogOpened(true),
    },
    {
      id: "retweet",
      Icon: Retweet,
      alt: "Retweet",
      value: 0,
      onClick: (_e: React.MouseEvent<HTMLButtonElement>) => {
        const buttonRect = retweetButtonRef.current!.getBoundingClientRect();
        setPopupPosition({
          top: buttonRect.top - 10,
          left: buttonRect.left,
        });
        setResparklePopupOpened(!retweetPopupOpened);
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

  const sparkleLink = activity.id
    ? generateSparkleLink(actor.data.username, activity.id)
    : "#";

  const onPostComment = async (text: string) =>
    await createComment(text, activity);

  return (
    <>
      <Block>
        <figure className="user-image">
          <Image
            src={actor.data.profileImage || "https://picsum.photos/500/300"}
            alt="profile"
          />
        </figure>
        <div className="tweet">
          <button onClick={() => navigate(sparkleLink)} className="link">
            <TweetActorName
              name={actor.data.name}
              id={actor.id}
              username={actor.data.username}
              time={activity.time}
            />
            <div className="tweet__details">
              <p
                className="tweet__text"
                dangerouslySetInnerHTML={{
                  __html: formatStringWithLink(
                    tweet.text,
                    "tweet__text--link"
                  ).replace(/\n/g, "<br/>"),
                }}
              />
            </div>
          </button>

          <div className="tweet__actions">
            {actions.map((action) => {
              return (
                <button
                  ref={action.id === "retweet" ? retweetButtonRef : null}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick?.(e);
                  }}
                  key={action.id}
                  type="button"
                >
                  <action.Icon
                    color={
                      action.id === "heart" && hasLikedSparkle
                        ? "var(--theme-color)"
                        : "#777"
                    }
                    size={17}
                    fill={
                      action.id === "heart" && hasLikedSparkle
                        ? true
                        : undefined
                    }
                  />
                  <span
                    className={classNames("tweet__actions__value", {
                      colored: action.id === "heart" && hasLikedSparkle,
                    })}
                  >
                    {action.value}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <button className="more">
          <More color="#777" size={20} />
        </button>
      </Block>
      {activity.id && commentDialogOpened && (
        <CommentDialog
          onPostComment={onPostComment}
          onClickOutside={() => setCommentDialogOpened(false)}
          activity={activity}
        />
      )}
      {retweetPopupOpened && (
        <ResparklePopup
          onClose={() => setResparklePopupOpened(false)}
          onResparkle={() => console.log("Resparkle clicked")}
          onQuote={() => console.log("Quote clicked")}
          position={popupPosition}
        />
      )}
    </>
  );
};

const Block = styled.div`
  display: flex;
  border-bottom: 1px solid #333;
  padding: 15px;

  .user-image {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .tweet {
    flex: 1;
    .link {
      display: block;
      padding-bottom: 5px;
      text-decoration: none;
      width: 100%;
    }

    &__text {
      color: white;
      font-size: 15px;
      line-height: 20px;
      margin-top: 3px;
      width: 100%;

      &--link {
        color: var(--theme-color);
        text-decoration: none;
      }
    }

    &__actions {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;

      button {
        display: flex;
        align-items: center;
      }

      &__value {
        margin-left: 10px;
        color: #666;

        &.colored {
          color: var(--theme-color);
        }
      }
    }

    &__image {
      margin-top: 20px;
      border-radius: 20px;
      border: 1px solid #333;
      overflow: hidden;
      width: calc(100% + 20px);

      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }

  .more {
    width: 40px;
    height: 40px;
    display: flex;
  }
`;

export default SparkleBlock;
