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
import { HiLightBulb } from "react-icons/hi";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import {
  Activity as AppActivity,
  ActivityObject,
  QuoteActivity,
} from "../../utils/types";
import { appUrl } from "../../services/client";
import {
  Bookmark,
  Comment,
  Heart,
  More,
  Resparkle,
  Upload,
} from "../../assets/icons";
import {
  copyToClipBorad,
  describeProject,
  ProjectData,
} from "../../utils/funcs";
import { EmbeddedSparkleBlock } from "../resparkle";
import { formatStringWithLink } from "../../utils/string";
import { generateSparkleLink } from "../../utils/links";
import { TabId } from "../profile/ProfileTabList";
import {
  useActivity,
  useComment,
  useFollow,
  useLike,
  useProfileUser,
  useQuoting,
  useResparkle,
  useSparkle,
} from "../../hooks";
import { IconType } from "../nav/BottomTab";
import CommentDialog from "./CommentDialog";
import MoreOptionsPopup, { Option } from "./MoreOptionPopup";
import QuoteDialog from "../quote/QuoteDialog";
import ResparklePopup from "./ResparklePopup";
import SparkleShareModal from "./SparkleShareModal";
import TweetActorName from "./SparkleActorName";

interface Props {
  activity: Activity;
  showMedia?: boolean;
}

type ActionId = "comment" | "resparkle" | "heart" | "upload" | "bookmark";

type Action = {
  id: ActionId;
  Icon: IconType;
  alt: string;
  value?: number;
  onClick: (arg?: any) => void;
};

const SparkleBlock: React.FC<Props> = ({ activity, showMedia }) => {
  const [commentDialogOpened, setCommentDialogOpened] = useState(false);
  const [moreOptions, setMoreOptions] = useState<Option[]>([]);
  const [morePopupOpened, setMorePopupOpened] = useState(false);
  const [quoteDialogOpened, setQuoteDialogOpened] = useState(false);
  const [retweetPopupOpened, setResparklePopupOpened] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { createComment } = useComment();
  const { createQuote } = useQuoting();
  const { hasBookmarked, hasLiked, hasResparkled, toggleBookmark } =
    useSparkle();
  const { setActivity } = useActivity();
  const { toggleLike } = useLike();
  const { toggleResparkle } = useResparkle();
  const { user } = useStreamContext();
  const { viewUserProfile } = useProfileUser();
  const feed = useFeedContext();
  const isAReaction = activity.foreign_id.startsWith("reaction");
  const location = useLocation();
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const resparkleButtonRef = useRef<HTMLButtonElement>(null);
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
  const hasLikedSparkle = hasLiked(activity);
  const hasResparkledSparkle = hasResparkled(activity);
  const hasBookmarkedSparkle = hasBookmarked(activity);
  const isAQuote = activity.verb === "quote";
  const isAProject = activity.verb === "project";
  const sparkleLink = generateSparkleLink(actor.data.username, appActivity.id);
  const completeSparkleLink = `${appUrl}${sparkleLink}`;
  const sparkleText = isAProject
    ? describeProject(appActivity.object?.data as unknown as ProjectData)
    : (sparkle || { text: "" }).text;

  const actions: Action[] = [
    {
      id: "comment",
      Icon: Comment,
      alt: "Comment",
      value: appActivity?.reaction_counts?.comment || 0,
      onClick: () => setCommentDialogOpened(true),
    },
    {
      id: "resparkle",
      Icon: Resparkle,
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
      onClick: () => setShowShareModal(true),
    },
    {
      id: "bookmark",
      Icon: Bookmark,
      alt: "Bookmark",
      onClick: () => toggleBookmark(activity),
    },
  ];

  useEffect(() => {
    initMoreOptions();

    function initMoreOptions() {
      if (moreOptions.length) return;

      const isTheAuthor = appActivity.actor.id === user?.id;

      const generalOptions: Option[] = [
        {
          Icon: <BsLink />,
          label: "Copy Link",
          onClick: () => copyToClipBorad(completeSparkleLink),
        },
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
  }, [
    activity.id,
    appActivity.actor.id,
    completeSparkleLink,
    feed,
    isFollowing,
    moreOptions.length,
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
    return toggleResparkle(
      appActivity as unknown as Activity,
      hasResparkledSparkle
    );
  }

  const handlePostComment = async (text: string) =>
    await createComment(text, appActivity as unknown as Activity);

  const startQuoting = () => {
    setActivity(appActivity as unknown as Activity);
    setQuoteDialogOpened(true);
  };

  const getIconColor = (name: ActionId): string => {
    let color = "#777";

    if (name === "heart" && hasLikedSparkle) color = "#f91880";
    else if (name === "resparkle" && hasResparkledSparkle) color = "#17BF63";
    else if (name === "bookmark" && hasBookmarkedSparkle)
      color = "var(--primary-color)";

    return color;
  };

  const getValueColor = (actionId: ActionId): string => {
    if (actionId === "heart" && hasLikedSparkle) return getIconColor(actionId);
    if (actionId === "resparkle" && hasResparkledSparkle)
      return getIconColor(actionId);
    return "#666";
  };

  const getResparklerName = (): string => {
    const { actor } = activity as unknown as AppActivity;
    const isSparkler = user?.id === actor.id || hasResparkledSparkle;
    const actorName = actor.data.name;

    // if (isSparkler && actorName) return `You and ${actorName}`;

    return isSparkler ? "You" : actorName;
  };

  const handleQuoteSubmit = async (quote: string) => {
    await createComment(quote, appActivity as unknown as Activity, "quote");
    await createQuote(quote, appActivity as unknown as Activity);
  };

  const viewDetails = () => navigate(activity.id ? sparkleLink : "#");

  const navigateToProfile = () => viewUserProfile(actor);

  const images: string[] = appActivity.attachments?.images || [];

  const params = new URLSearchParams(location.search);
  const tabLabel = params.get("tab");
  if (
    tabLabel &&
    (tabLabel as TabId).toLowerCase() === "media" &&
    !images.length
  )
    return null;

  if (showMedia && !images.length) return null;

  return (
    <Box _hover={{ bg: "#111" }} onClick={viewDetails}>
      <Block>
        <Flex align="center" ml={10}>
          {isAProject && (
            <Flex align="center">
              <Box mb={1.5}>
                <HiLightBulb color="#fff" size={24} />
              </Box>
              <Text ml={2} fontWeight={600} color="#fff">
                Project
              </Text>
            </Flex>
          )}

          {(isAReaction || hasResparkledSparkle) && (
            <Flex align="center" mb={1.5} color="#777" fontSize="small" ml={5}>
              <Resparkle color="#777" size={13} />
              <Text ml={1} fontWeight={700}>
                {getResparklerName()} resparkled
              </Text>
            </Flex>
          )}
        </Flex>

        <Flex cursor="pointer">
          <figure className="user-image" onClick={navigateToProfile}>
            <Avatar image={actor.data.profileImage} />
          </figure>
          <div className="tweet" onClick={viewDetails}>
            <button className="link">
              <TweetActorName {...actor.data} time={activity.time} />
              <div className="tweet__details">
                <Text
                  noOfLines={morePopupOpened ? undefined : 8}
                  className="tweet__text"
                  dangerouslySetInnerHTML={{
                    __html: formatStringWithLink(
                      sparkleText,
                      "tweet__text--link"
                    )?.replace(/\n/g, "<br/>"),
                  }}
                />
                {!morePopupOpened && (sparkle?.text?.length || 0) > 150 && (
                  <button
                    onClick={() => setMorePopupOpened(true)}
                    style={{
                      color: "var(--blue-color)",
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
                      color={getIconColor(action.id)}
                      size={17}
                      fill={
                        (action.id === "heart" && hasLikedSparkle) ||
                        (action.id === "bookmark" && hasBookmarkedSparkle)
                      }
                    />
                    <ActionValue color={getValueColor(action.id)}>
                      {action.value}
                    </ActionValue>
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
          hasBeenResparkled={hasResparkledSparkle}
          onQuote={startQuoting}
          position={resparklePopupPosition}
        />
      )}
      <SparkleShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        sparkleUrl={completeSparkleLink}
        text={sparkleText}
      />
    </Box>
  );
};

const ActionValue = styled.span<{ color: string }>`
  margin-left: 10px;
  color: ${(props) => props.color};
`;

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
        color: var(--blue-color);
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
