import { format } from "date-fns";
import { Avatar, Gallery, useFeedContext } from "react-activity-feed";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useRef, useState } from "react";
import { Activity as MainActivity } from "getstream";
import { toast } from "react-toastify";
import { Box, BoxProps, Flex, Text } from "@chakra-ui/react";

import { Activity, QuoteActivity } from "../../utils/types";
import { EmbeddedSparkleBlock } from "../resparkle";
import { formatStringWithLink } from "../../utils/string";
import {
  useActivity,
  useProfileUser,
  useQuotes,
  useResparkle,
  useSparkle,
  useUser,
} from "../../hooks";
import { appUrl } from "../../services/client";
import {
  Bookmark,
  Comment,
  Heart,
  More,
  Resparkle,
  Upload,
} from "../../assets/icons";
import { describeProject, ProjectData } from "../../utils/funcs";
import { generateSparkleLink } from "../../utils/links";
import FollowButton from "../FollowButton";
import ResparklePopup from "../sparkle/ResparklePopup";
import SparkleCommentBlock from "./SparkleCommentBlock";
import SparkleShareModal from "../sparkle/SparkleShareModal";
import TweetForm from "../sparkle/SparkleForm";
import useComment from "../../hooks/useComment";
import useLike from "../../hooks/useLike";
import CommentDialog from "../sparkle/CommentDialog";
import { HiLightBulb } from "react-icons/hi";

interface Props {
  activity: MainActivity;
}

export default function SparkleContent({ activity }: Props) {
  const [commentDialogOpened, setCommentDialogOpened] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [resparklePopupOpened, setResparklePopupOpened] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { hasBookmarked, hasLiked, hasResparkled } = useSparkle();
  const { createComment } = useComment();
  const { setActivity } = useActivity();
  const { viewUserProfile } = useProfileUser();
  const { setQuotes } = useQuotes();
  const { toggleLike } = useLike();
  const { toggleResparkle } = useResparkle();
  const { user } = useUser();
  const feed = useFeedContext();
  const navigate = useNavigate();
  const resparkleButtonRef = useRef<HTMLButtonElement>(null);

  const time = format(activity.time, "p");
  const date = format(activity.time, "PP");

  const appActivity = activity as unknown as Activity;
  const sparkle = appActivity.object.data;
  const sparkleActor = appActivity.actor.data;
  const likesCount = appActivity.reaction_counts.like || 0;
  const resparklesCount = appActivity.reaction_counts.resparkle || 0;
  const quotesCount = appActivity.reaction_counts.quote || 0;
  const hasLikedSparkled = hasLiked(appActivity);
  const hasBeenResparkled = hasResparkled(appActivity);
  const hasBookmarkedSparkle = hasBookmarked(appActivity);
  const isAQuote = activity.verb === "quote";
  const isAProject = activity.verb === "project";
  const images: string[] = appActivity.attachments?.images || [];
  const sparkleText = isAProject
    ? describeProject(appActivity.object?.data as unknown as ProjectData)
    : (sparkle || { text: "" }).text;

  const sparkleLink = generateSparkleLink(
    sparkleActor.username,
    appActivity.id
  );
  const completeSparkleLink = `${appUrl}${sparkleLink}`;

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
      Icon: Resparkle,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        const buttonRect = resparkleButtonRef.current!.getBoundingClientRect();
        setPopupPosition({ top: buttonRect.top - 10, left: buttonRect.left });
        setResparklePopupOpened(!resparklePopupOpened);
      },
    },
    { id: "heart", Icon: Heart, onClick: onToggleLike },
    { id: "upload", Icon: Upload, onClick: () => setShowShareModal(true) },
    { id: "bookmark", Icon: Bookmark, onClick: () => {} },
  ];

  const onPostComment = async (text: string) => {
    if (!user) return toast.info("Login to send reply");
    if (commenting) return;

    setCommenting(true);
    toast.loading("Saving comment...");
    await createComment(text, activity);
    toast.dismiss();
    setCommenting(false);
    feed.refresh();
  };

  const quoteSparkle = () => {
    setActivity(activity);
    navigate(`/${sparkleActor.username}/status/${activity.id}/quote`);
  };

  const viewQuotes = () => {
    const quotes = appActivity.own_reactions.quote;
    if (quotes) {
      setQuotes(quotes);
      setActivity(activity);
      navigate("quotes");
    }
  };

  const handleResparkle = async () => {
    await toggleResparkle(
      activity as unknown as MainActivity,
      hasBeenResparkled
    );
    feed.refresh();
  };

  const visitProfile = () => viewUserProfile(appActivity.actor);

  return (
    <Container>
      {isAProject && (
        <Flex align="center" mb={3.5}>
          <Box>
            <HiLightBulb color="#fff" size={24} />
          </Box>
          <Text ml={2} fontWeight={600} color="#fff">
            Project
          </Text>
        </Flex>
      )}

      <UserSection onClick={visitProfile}>
        <UserAvatar>
          <Avatar image={sparkleActor.profileImage} size={48} />
        </UserAvatar>
        <UserInfo>
          <UserName>
            {sparkleActor.name}
            {sparkleActor.verified && (
              <VerifiedIcon
                src={
                  sparkleActor.isAdmin
                    ? require("../../assets/admin.png")
                    : require("../../assets/verified.png")
                }
                alt="Verified"
              />
            )}
          </UserName>
          <UserHandle>@{sparkleActor.username}</UserHandle>
        </UserInfo>
        {user?._id !== sparkleActor.id && (
          <UserActions>
            <FollowButton userId={sparkleActor.id} />
            <MoreButton>
              <More color={theme.grayColor} size={18} />
            </MoreButton>
          </UserActions>
        )}
      </UserSection>

      <TweetContent>
        <TweetText
          dangerouslySetInnerHTML={{
            __html: formatStringWithLink(sparkleText, "tweet-link")?.replace(
              /\n/g,
              "<br/>"
            ),
          }}
        />
        {images.length > 0 && (
          <GalleryWrapper>
            <Gallery images={images} style={{ borderRadius: 12 }} />
          </GalleryWrapper>
        )}
        {isAQuote && (
          <EmbeddedSparkleBlock
            activity={
              (appActivity as unknown as QuoteActivity)
                .quoted_activity as unknown as MainActivity
            }
          />
        )}
        <TweetMeta>
          <Time>{time}</Time>
          <DateSeparator />
          <Date>{date}</Date>
        </TweetMeta>

        {(likesCount || resparklesCount || quotesCount) && (
          <Reactions>
            {likesCount > 0 && (
              <ReactionItem>
                <ReactionCount>{likesCount}</ReactionCount>
                <ReactionLabel>Like{likesCount === 1 ? "" : "s"}</ReactionLabel>
              </ReactionItem>
            )}
            {resparklesCount > 0 && (
              <ReactionItem onClick={viewQuotes}>
                <ReactionCount>{resparklesCount}</ReactionCount>
                <ReactionLabel>
                  Resparkle{resparklesCount === 1 ? "" : "s"}
                </ReactionLabel>
              </ReactionItem>
            )}
            {quotesCount > 0 && (
              <ReactionItem onClick={viewQuotes}>
                <ReactionCount>{quotesCount}</ReactionCount>
                <ReactionLabel>
                  Quote{quotesCount === 1 ? "" : "s"}
                </ReactionLabel>
              </ReactionItem>
            )}
          </Reactions>
        )}

        <Reactors>
          {reactors.map((action) => (
            <ReactorButton
              key={action.id}
              onClick={action.onClick}
              ref={action.id === "resparkle" ? resparkleButtonRef : null}
              aria-label={action.id}
            >
              <action.Icon
                color={
                  action.id === "heart" && hasLikedSparkled
                    ? "#F91880"
                    : action.id === "resparkle" && hasBeenResparkled
                    ? "#17BF63"
                    : theme.grayColor
                }
                fill={
                  (action.id === "heart" && hasLikedSparkled) ||
                  (action.id === "bookmark" && hasBookmarkedSparkle)
                }
                size={18}
              />
            </ReactorButton>
          ))}
        </Reactors>

        <ReplySection>
          <TweetForm
            onSubmit={onPostComment}
            submitText="Reply"
            collapsedOnMount={true}
            placeholder="Sparkle your reply"
            replyingTo={sparkleActor.username}
            sparkling={commenting}
          />
        </ReplySection>

        {appActivity.latest_reactions?.comment?.map((comment) => (
          <SparkleCommentBlock key={comment.id} comment={comment} />
        ))}
      </TweetContent>

      <SparkleShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        sparkleUrl={completeSparkleLink}
        text={sparkle.text}
      />
      {resparklePopupOpened && (
        <ResparklePopup
          onClose={() => setResparklePopupOpened(false)}
          onQuote={quoteSparkle}
          onResparkle={handleResparkle}
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
    </Container>
  );
}

const theme = {
  primaryColor: "var(--primary-color)", // #1da1f2
  primaryHoverColor: "var(--primary-hover-color)", // #1a91da
  backgroundColor: "var(--background-color)", // #15202b
  borderColor: "var(--border-color)", // #38444d
  textColor: "var(--text-color)", // #fff
  grayColor: "var(--gray-color)", // #888888
};

const Container = styled.div`
  padding: 12px 15px;
  border-bottom: 1px solid ${theme.borderColor};
  color: ${theme.textColor};
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`;

const UserAvatar = styled.figure`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 0.9;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.span`
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
`;

const VerifiedIcon = styled.img`
  width: 18px;
  height: 18px;
  margin-left: 4px;
`;

const UserHandle = styled.span`
  font-size: 0.9rem;
  color: ${theme.grayColor};
`;

const UserActions = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TweetContent = styled.div`
  margin-top: 8px;
`;

const TweetText = styled.p`
  font-size: 1.1rem;
  line-height: 1.4;
  word-wrap: break-word;
  .tweet-link {
    color: ${theme.primaryColor};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const GalleryWrapper = styled(Box)<BoxProps>`
  margin-top: 12px;
`;

const TweetMeta = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${theme.grayColor};
  margin-top: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${theme.borderColor};
`;

const Time = styled.span``;

const DateSeparator = styled.span`
  width: 2px;
  height: 2px;
  background: ${theme.grayColor};
  border-radius: 50%;
  margin: 0 6px;
`;

const Date = styled.span``;

const Reactions = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${theme.borderColor};
`;

const ReactionItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
  &:hover {
    color: ${theme.primaryColor};
  }
`;

const ReactionCount = styled.span`
  font-weight: 700;
  margin-right: 4px;
`;

const ReactionLabel = styled.span`
  font-size: 0.9rem;
`;

const Reactors = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid ${theme.borderColor};
`;

const ReactorButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ReplySection = styled.div`
  padding: 8px 0;
`;
