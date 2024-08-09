import React, { useState, useRef, useEffect } from "react";
import { useStreamContext } from "react-activity-feed";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import classNames from "classnames";
import { Activity } from "getstream";

import {
  Activity as AppActivity,
  ActivityObject,
  QuoteActivity,
} from "../../utils/types";
import { formatStringWithLink } from "../../utils/string";
import { generateSparkleLink } from "../../utils/links";
import {
  useActivity,
  useComment,
  useLike,
  useQuoting,
  useResparkle,
  useSparkle,
} from "../../hooks";
// import More from "../icons/More";
import { EmbeddedSparkleBlock } from "../resparkle";
import Comment from "../icons/Comment";
import CommentDialog from "./CommentDialog ";
import Heart from "../icons/Heart";
import QuoteDialog from "../quote/QuoteDialog";
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
  const [quoteDialogOpened, setQuoteDialogOpened] = useState(false);
  const [retweetPopupOpened, setResparklePopupOpened] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const resparkleButtonRef = useRef<HTMLButtonElement>(null);
  const { setActivity } = useActivity();
  const { toggleResparkle } = useResparkle();
  const { createQuote } = useQuoting();
  const { deleteSparkle, checkIfHasLiked, checkIfHasResparkled } = useSparkle();
  const isAReaction = activity.foreign_id.startsWith("reaction");
  const sparkle = isAReaction
    ? (activity.object as unknown as AppActivity).object.data
    : (activity.object as unknown as ActivityObject).data;

  useEffect(() => {
    if (isAReaction && !sparkle) deleteSparkle(activity.id);
  }, [activity.id, deleteSparkle, isAReaction, sparkle]);

  const appActivity = isAReaction
    ? (activity.object as unknown as AppActivity)
    : (activity as unknown as AppActivity);
  const actor = appActivity.actor;
  const hasLikedSparkle = checkIfHasLiked(appActivity);
  const hasResparkled = checkIfHasResparkled(appActivity);
  const isAQuote = activity.verb === "quote";

  const onToggleLike = () =>
    toggleLike(appActivity as unknown as Activity, hasLikedSparkle);

  const handleResparkle = () =>
    toggleResparkle(appActivity as unknown as Activity, hasResparkled);

  const actions = [
    {
      id: "comment",
      Icon: Comment,
      alt: "Comment",
      value: appActivity?.reaction_counts?.comment || 0,
      onClick: () => setCommentDialogOpened(true),
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
    ? generateSparkleLink(actor.data.username, appActivity.id)
    : "#";

  const handlePostComment = async (text: string) =>
    await createComment(text, appActivity as unknown as Activity);

  const startQuoting = () => {
    setActivity(appActivity as unknown as Activity);
    setQuoteDialogOpened(true);
  };

  const getColor = (name: string) => {
    if (name === "heart")
      return hasLikedSparkle ? "var(--theme-color)" : "#777";
    else if (name === "resparkle") return hasResparkled ? "#17BF63" : "#777";
    return "#777";
  };

  const getResparklerName = () => {
    const act = activity as unknown as AppActivity;
    const isSparkler = user?.id === act.actor.id;

    return isSparkler ? "You" : act.actor.data.name;
  };

  const handleQuoteSubmit = async (quote: string) => {
    await createComment(quote, appActivity as unknown as Activity, "quote");
    await createQuote(quote, appActivity as unknown as Activity);
  };

  return (
    <Box _hover={{ bg: "#111" }}>
      <Block>
        {isAReaction && (
          <Flex align="center" mb={1.5} color="#777" fontSize="small" ml={10}>
            <Retweet color="#777" size={13} />
            <Text ml={1}>{getResparklerName()} resparkled</Text>
          </Flex>
        )}
        <Flex cursor="pointer">
          <figure
            className="user-image"
            onClick={() => navigate(`/${actor.data.username}`)}
          >
            <Image
              src={actor.data.profileImage || "https://picsum.photos/500/300"}
              alt="profile"
            />
          </figure>
          <div className="tweet" onClick={() => navigate(sparkleLink)}>
            <button className="link">
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
                      (sparkle || { text: "" }).text,
                      "tweet__text--link"
                    ).replace(/\n/g, "<br/>"),
                  }}
                />
              </div>
            </button>
            {isAQuote && (
              <EmbeddedSparkleBlock
                activity={
                  (appActivity as unknown as QuoteActivity)
                    .quoted_activity as unknown as Activity
                }
              />
            )}
            <div className="tweet__actions" onClick={console.log}>
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
                      className={classNames("tweet__actions__value", {
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
            </div>
          </div>
          {/* <button className="more">
            <More color="#777" size={20} />
          </button> */}
        </Flex>
      </Block>
      {appActivity.id && quoteDialogOpened && (
        <QuoteDialog
          activity={appActivity as unknown as Activity}
          onClose={() => setQuoteDialogOpened(false)}
          onQuoteSubmit={handleQuoteSubmit}
        />
      )}
      {appActivity.id && commentDialogOpened && (
        <CommentDialog
          onPostComment={handlePostComment}
          onClickOutside={() => setCommentDialogOpened(false)}
          activity={appActivity as unknown as Activity}
        />
      )}
      {retweetPopupOpened && (
        <ResparklePopup
          onClose={() => setResparklePopupOpened(false)}
          onResparkle={handleResparkle}
          hasBeenResparkled={hasResparkled}
          onQuote={startQuoting}
          position={popupPosition}
        />
      )}
    </Box>
  );
};

const Block = styled.div`
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
    margin-top: 5px;

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

        &.green {
          color: #17bf63;
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
