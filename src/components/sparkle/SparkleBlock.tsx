import React, { useState, useRef, useEffect } from "react";
import {
  Avatar,
  Gallery,
  useFeedContext,
  useStreamContext,
} from "react-activity-feed";
import { Activity } from "getstream";
import { Box, Flex, Text } from "@chakra-ui/react";
import { BsLink, BsPencil, BsTrash } from "react-icons/bs";
import { FaUserMinus, FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import styled from "styled-components";

import {
  Activity as AppActivity,
  ActivityObject,
  QuoteActivity,
} from "../../utils/types";
import { appUrl } from "../../services/client";
import { copyToClipBorad } from "../../utils/funcs";
import { EmbeddedSparkleBlock } from "../resparkle";
import { formatStringWithLink } from "../../utils/string";
import { generateSparkleLink } from "../../utils/links";
import { TabId } from "../profile/TabList";
import {
  useActivity,
  useComment,
  useFollow,
  useLike,
  useProfile,
  useQuoting,
  useResparkle,
  useSparkle,
} from "../../hooks";
import Comment from "../icons/Comment";
import CommentDialog from "./CommentDialog ";
import Heart from "../icons/Heart";
import More from "../icons/More";
import MoreOptionsPopup, { Option } from "./MoreOptionPopup";
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
  const feed = useFeedContext();
  const { toggleLike } = useLike();
  const { createComment } = useComment();
  const navigate = useNavigate();
  const [commentDialogOpened, setCommentDialogOpened] = useState(false);
  const [quoteDialogOpened, setQuoteDialogOpened] = useState(false);
  const [retweetPopupOpened, setResparklePopupOpened] = useState(false);
  const [morePopupOpened, setMorePopupOpened] = useState(false);
  const [moreOptions, setMoreOptions] = useState<Option[]>([]);
  const resparkleButtonRef = useRef<HTMLButtonElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const { setActivity } = useActivity();
  const { toggleResparkle } = useResparkle();
  const { createQuote } = useQuoting();
  const location = useLocation();
  const { setUser } = useProfile();
  const { checkIfHasLiked, checkIfHasResparkled } = useSparkle();
  const isAReaction = activity.foreign_id.startsWith("reaction");
  const appActivity = isAReaction
    ? (activity.object as unknown as AppActivity)
    : (activity as unknown as AppActivity);
  const { isFollowing, toggleFollow } = useFollow({
    userId: appActivity.actor.id,
  });
  const [resparklePopupPosition, setResparklePopupPosition] = useState({
    top: 0,
    left: 0,
  });
  const [morePopupPosition, setMorePopupPosition] = useState({
    top: 0,
    right: 0,
  });

  const sparkle = isAReaction
    ? (activity.object as unknown as AppActivity).object.data
    : (activity.object as unknown as ActivityObject).data;
  const actor = appActivity.actor;
  const hasLikedSparkle = checkIfHasLiked(appActivity);
  const hasResparkled = checkIfHasResparkled(appActivity);
  const isAQuote = activity.verb === "quote";
  const sparkleLink = generateSparkleLink(actor.data.username, appActivity.id);

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
        setResparklePopupPosition({
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

  useEffect(() => {
    initMoreOptions();

    function initMoreOptions() {
      const isTheAuthor = appActivity.actor.id === user?.id;

      const generalOptions: Option[] = [
        { Icon: <BsLink />, label: "Copy Link", onClick: copySparkleUrl },
      ];

      const authorOptions: Option[] = [
        {
          Icon: <BsTrash />,
          label: "Delete Sparkle",
          onClick: deleteSparkle,
        },
        {
          Icon: <BsPencil />,
          label: "Edit Sparkle",
          onClick: () => toast.info("sparkle edit coming soon"),
        },
      ];

      const followUnfollowOption: Option = {
        Icon: isFollowing ? <FaUserMinus /> : <FaUserPlus />,
        label: isFollowing ? "Unfollow" : "Follow",
        onClick: toggleFollow,
      };

      const authorised = isTheAuthor ? authorOptions : [followUnfollowOption];

      setMoreOptions([...authorised, ...generalOptions]);
    }

    async function deleteSparkle() {
      toast.loading("Deleting sparkle...");
      await feed.onRemoveActivity(activity.id);
      feed.refresh();
      toast.dismiss();
    }

    function copySparkleUrl() {
      copyToClipBorad(`${appUrl}${sparkleLink}`);
    }
  }, [
    activity.id,
    actor.data.username,
    appActivity.actor.id,
    appActivity.id,
    feed,
    isFollowing,
    sparkleLink,
    toggleFollow,
    user?.id,
  ]);

  const toggleMorePopup = (event: React.MouseEvent) => {
    event.stopPropagation();
    const buttonRect = moreButtonRef.current!.getBoundingClientRect();

    setMorePopupPosition({
      top: buttonRect.top + window.scrollY + 20,
      right: window.innerWidth - buttonRect.right,
    });
    setMorePopupOpened((prev) => !prev);
  };

  function onToggleLike() {
    return toggleLike(appActivity as unknown as Activity, hasLikedSparkle);
  }

  function handleResparkle() {
    return toggleResparkle(appActivity as unknown as Activity, hasResparkled);
  }

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
    const isSparkler = user?.id === act.actor.id || hasResparkled;

    return isSparkler ? "You" : act.actor.data.name;
  };

  const handleQuoteSubmit = async (quote: string) => {
    await createComment(quote, appActivity as unknown as Activity, "quote");
    await createQuote(quote, appActivity as unknown as Activity);
  };

  const viewDetails = () => navigate(activity.id ? sparkleLink : "#");

  const navigateToProfile = () => {
    navigate(`/${actor.data.username}`);
    setUser(actor);
  };

  const images: string[] = appActivity.attachments?.images || [];

  const params = new URLSearchParams(location.search);
  const tabLabel = params.get("tab");
  if (
    tabLabel &&
    (tabLabel as TabId).toLowerCase() === "media" &&
    !images.length
  )
    return null;

  return (
    <Box _hover={{ bg: "#111" }}>
      <Block>
        {(isAReaction || hasResparkled) && (
          <Flex align="center" mb={1.5} color="#777" fontSize="small" ml={10}>
            <Retweet color="#777" size={13} />
            <Text ml={1} fontWeight={700}>
              {getResparklerName()} resparkled
            </Text>
          </Flex>
        )}
        <Flex cursor="pointer">
          <figure className="user-image" onClick={navigateToProfile}>
            <Avatar image={actor.data.profileImage} />
          </figure>
          <div className="tweet" onClick={viewDetails}>
            <button className="link">
              <TweetActorName
                name={actor.data.name}
                id={actor.id}
                username={actor.data.username}
                time={activity.time}
                verified={Boolean(actor.data.verified)}
              />
              <div className="tweet__details">
                <Text
                  noOfLines={morePopupOpened ? undefined : 3}
                  className="tweet__text"
                  dangerouslySetInnerHTML={{
                    __html: formatStringWithLink(
                      (sparkle || { text: "" }).text,
                      "tweet__text--link"
                    ).replace(/\n/g, "<br/>"),
                  }}
                />
                {!morePopupOpened && (sparkle?.text?.length || 0) > 150 && (
                  <button
                    onClick={() => setMorePopupOpened(true)}
                    style={{
                      color: "var(--theme-color)",
                      cursor: "pointer",
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      fontSize: "15px",
                    }}
                  >
                    Read more
                  </button>
                )}
              </div>
              {Boolean(images.length) && (
                <Box mt={2}>
                  <Gallery
                    images={images}
                    style={{ borderRadius: 15, border: "none" }}
                  />
                </Box>
              )}
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
          <button
            ref={moreButtonRef}
            className="more"
            onClick={toggleMorePopup}
          >
            <More color="#777" size={20} />
          </button>
        </Flex>
      </Block>
      {morePopupOpened && (
        <MoreOptionsPopup
          position={morePopupPosition}
          options={moreOptions}
          onClose={() => setMorePopupOpened(false)}
        />
      )}
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
          position={resparklePopupPosition}
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
