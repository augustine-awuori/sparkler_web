import { format } from "date-fns";
import { useFeedContext } from "react-activity-feed";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useRef, useState } from "react";
import { Activity as MainActivity } from "getstream";
import { Box, Image } from "@chakra-ui/react";

import { Activity, QuoteActivity, randomImageUrl } from "../../utils/types";
import { EmbeddedSparkleBlock } from "../resparkle";
import { formatStringWithLink } from "../../utils/string";
import { useActivity, useSparkle } from "../../hooks";
import BarChart from "../icons/BarChart";
import Comment from "../icons/Comment";
import CommentDialog from "../sparkle/CommentDialog ";
import Heart from "../icons/Heart";
import More from "../icons/More";
import ResparklePopup from "../sparkle/ResparklePopup";
import Retweet from "../icons/Retweet";
import SparkleCommentBlock from "./SparkleCommentBlock";
import TweetForm from "../sparkle/SparkleForm";
import Upload from "../icons/Upload";
import useComment from "../../hooks/useComment";
import useLike from "../../hooks/useLike";

interface Props {
  activity: MainActivity;
}

export default function SparkleContent({ activity }: Props) {
  const feed = useFeedContext();
  const { createComment } = useComment();
  const { toggleLike } = useLike();
  const [commentDialogOpened, setCommentDialogOpened] = useState(false);
  const [resparklePopupOpened, setResparklePopupOpened] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const navigate = useNavigate();
  const { setActivity } = useActivity();
  const resparkleButtonRef = useRef<HTMLButtonElement>(null);
  const { checkIfHasLiked, checkIfHasResparkled } = useSparkle();

  const time = format(new Date(activity.time), "p");
  const date = format(new Date(activity.time), "PP");

  const appActivity = activity as unknown as Activity;
  const tweet = appActivity.object.data;
  const tweetActor = appActivity.actor.data;
  const likesCount = appActivity.reaction_counts.like || 0;
  const resparklesCount = appActivity.reaction_counts.resparkle || "0";
  const hasLikedSparkled = checkIfHasLiked(appActivity);
  const hasBeenResparkled = checkIfHasResparkled(appActivity);
  const isAQuote = activity.verb === "quote";

  const onToggleLike = async () => {
    await toggleLike(activity, hasLikedSparkled);
    feed.refresh();
  };

  const reactors = [
    {
      id: "comment",
      Icon: Comment,
      onClick: () => setCommentDialogOpened(true),
    },
    {
      id: "resparkle",
      Icon: Retweet,
      onClick: (_e: React.MouseEvent<HTMLButtonElement>) => {
        const buttonRect = resparkleButtonRef.current!.getBoundingClientRect();
        setPopupPosition({
          top: buttonRect.top - 10,
          left: buttonRect.left,
        });
        setResparklePopupOpened(!resparklePopupOpened);
      },
    },
    {
      id: "heart",
      Icon: Heart,
      onClick: onToggleLike,
    },
    { id: "upload", Icon: Upload },
  ];

  const onPostComment = async (text: string) => {
    await createComment(text, activity);

    feed.refresh();
  };

  const quoteSparkle = () => {
    setActivity(activity);
    navigate(`/${tweetActor.username}/status/${activity.id}/quote`);
  };

  return (
    <>
      {resparklePopupOpened && (
        <ResparklePopup
          onClose={() => setResparklePopupOpened(false)}
          onQuote={quoteSparkle}
          onResparkle={console.log}
          position={popupPosition}
          hasBeenResparkled={hasBeenResparkled}
        />
      )}
      {commentDialogOpened && (
        <CommentDialog
          activity={activity}
          onPostComment={onPostComment}
          onClickOutside={() => setCommentDialogOpened(false)}
        />
      )}
      <Container>
        <Link to={`/${tweetActor.id}`} className="user">
          <figure className="user__image">
            <Image
              objectFit="cover"
              src={tweetActor?.profileImage || randomImageUrl}
              alt="profile"
            />
          </figure>
          <div className="user__name">
            <span className="user__name--name">{tweetActor.name}</span>
            <span className="user__name--id">@{tweetActor.username}</span>
          </div>
          <div className="user__option">
            <More color="#777" size={20} />
          </div>
        </Link>
        <div className="tweet">
          <p
            className="tweet__text"
            dangerouslySetInnerHTML={{
              __html: formatStringWithLink(
                tweet.text,
                "tweet__text--link"
              ).replace(/\n/g, "<br/>"),
            }}
          />
          {isAQuote && (
            <EmbeddedSparkleBlock
              activity={
                (appActivity as unknown as QuoteActivity)
                  .quoted_activity as unknown as MainActivity
              }
            />
          )}
          <div className="tweet__time">
            <span className="tweet__time--time">{time}</span>
            <span className="tweet__time--date">{date}</span>
          </div>

          <div className="tweet__analytics">
            <BarChart color="#888" />
            <span className="tweet__analytics__text">
              View Sparkle Analytics
            </span>
          </div>

          {(likesCount > 0 || resparklesCount !== "0") && (
            <div className="tweet__reactions">
              {likesCount > 0 && (
                <Box cursor="pointer" className="tweet__reactions__likes">
                  <span className="reaction-count">{likesCount}</span>
                  <span className="reaction-label">
                    Like{likesCount === 1 ? "" : "s"}
                  </span>
                </Box>
              )}

              {resparklesCount !== "0" && (
                <Box
                  cursor="pointer"
                  className="tweet__reactions__likes"
                  ml={2}
                >
                  <span className="reaction-count">{resparklesCount}</span>
                  <span className="reaction-label">
                    Resparkle{resparklesCount === 1 ? "" : "s"}
                  </span>
                </Box>
              )}
            </div>
          )}

          <div className="tweet__reactors">
            {reactors.map((action, i) => (
              <button
                onClick={action.onClick}
                key={`reactor-${i}`}
                ref={action.id === "resparkle" ? resparkleButtonRef : null}
              >
                <action.Icon
                  color={
                    action.id === "heart" && hasLikedSparkled
                      ? "var(--theme-color)"
                      : action.id === "resparkle" && hasBeenResparkled
                      ? "#17BF63"
                      : "#888"
                  }
                  fill={action.id === "heart" && hasLikedSparkled && true}
                  size={20}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="write-reply">
          <TweetForm
            onSubmit={onPostComment}
            submitText="Reply"
            collapsedOnMount={true}
            placeholder="Sparkle your reply"
            replyingTo={tweetActor.id}
          />
        </div>
        {appActivity.latest_reactions?.comment?.map((comment) => (
          <SparkleCommentBlock key={comment.id} comment={comment} />
        ))}
      </Container>
    </>
  );
}

const Container = styled.div`
  padding: 10px 15px;

  .user {
    display: flex;
    text-decoration: none;

    &__image {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 15px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    &__name {
      &--name {
        color: white;
        font-weight: bold;
      }
      &--id {
        color: #52575b;
        font-size: 14px;
      }
    }

    &__option {
      margin-left: auto;
    }
  }

  .tweet {
    margin-top: 20px;
    margin-bottom: 5px;

    a {
      text-decoration: none;
      color: var(--theme-color);
    }

    &__text {
      color: white;
      font-size: 20px;
    }

    &__time,
    &__analytics,
    &__reactions,
    &__reactors {
      height: 50px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #555;
      font-size: 15px;
      color: #888;
    }

    &__time {
      &--date {
        margin-left: 12px;
        position: relative;

        &::after {
          position: absolute;
          content: "";
          width: 2px;
          height: 2px;
          background-color: #777;
          border-radius: 50%;
          top: 0;
          bottom: 0;
          left: -7px;
          margin: auto 0;
        }
      }
    }

    &__analytics {
      &__text {
        margin-left: 7px;
      }
    }

    &__reactions {
      &__likes {
        display: flex;

        .reaction-count {
          color: white;
          font-weight: bold;
        }

        .reaction-label {
          margin-left: 4px;
        }
      }
    }

    &__reactors {
      justify-content: space-between;
      padding: 0 50px;
    }
  }

  .write-reply {
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #555;
  }
`;
