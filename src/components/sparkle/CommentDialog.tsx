import { useState } from "react";
import { Activity as MainActivity } from "getstream";
import { toast } from "react-toastify";
import styled from "styled-components";

import { Activity } from "../../utils/types";
import { formatStringWithLink } from "../../utils/string";
import Modal from "../Modal";
import SparkleActorName from "./SparkleActorName";
import SparkleForm from "./SparkleForm";

interface Props {
  activity: MainActivity;
  onClickOutside: () => void;
  onPostComment: (comment: string) => Promise<any>;
}

export default function CommentDialog(props: Props) {
  const [commenting, setCommenting] = useState(false);

  const { activity, onPostComment, onClickOutside } = props;
  const {
    actor,
    object: { data: sparkle },
  } = activity as unknown as Activity;

  const handleCommentSubmit = async (text: string) => {
    if (commenting) return;

    setCommenting(true);
    toast.loading("Saving comment...");
    await onPostComment(text);
    toast.dismiss();
    setCommenting(false);
    onClickOutside();
  };

  return (
    <Container>
      <Modal onClickOutside={onClickOutside} className="modal-block">
        <BlockContent>
          <TweetSection>
            <TweetAvatar>
              <img
                src={actor.data.profileImage}
                alt={`${actor.data.username}'s avatar`}
              />
            </TweetAvatar>
            <TweetDetails>
              <SparkleActorName time={activity.time} {...actor.data} />
              <p
                dangerouslySetInnerHTML={{
                  __html: formatStringWithLink(
                    sparkle.text,
                    "tweet-link",
                    true
                  ).replace(/\n/g, "<br/>"),
                }}
              />
              <ReplyingInfo>
                Replying to{" "}
                <ReplyingActor>@{actor.data.username}</ReplyingActor>
              </ReplyingInfo>
            </TweetDetails>
            <ConnectorLine />
          </TweetSection>
          <CommentSection>
            <SparkleForm
              className="comment-form"
              submitText="Reply"
              placeholder="Sparkle your reply"
              onSubmit={handleCommentSubmit}
              sparkling={commenting}
              shouldFocus
            />
          </CommentSection>
        </BlockContent>
      </Modal>
    </Container>
  );
}

const theme = {
  primaryColor: "var(--primary-color)",
  primaryHoverColor: "var(--primary-hover-color)",
  backgroundColor: "var(--background-color)",
  borderColor: "var(--border-color)",
  textColor: "var(--text-color)",
  grayColor: "var(--gray-color)",
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const BlockContent = styled.div`
  width: 100%;
  max-width: 600px; // Constrain width like X.com
  background: ${theme.backgroundColor};
  border-radius: 16px;
  padding: 15px;
`;

const TweetSection = styled.div`
  display: flex;
  position: relative;
  margin-top: 10px;
`;

const TweetAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  transition: opacity 0.2s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    opacity: 0.9;
  }
`;

const TweetDetails = styled.div`
  flex: 1;
  .actor-name {
    font-size: 0.9rem;
    &--name {
      color: ${theme.textColor};
      font-weight: 700;
    }
    &--id {
      color: ${theme.grayColor};
    }
  }

  .tweet-text {
    color: ${theme.textColor};
    font-size: 1rem;
    margin-top: 4px;
    line-height: 1.4;
    word-wrap: break-word;

    .tweet-link {
      color: ${theme.primaryColor};
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const ConnectorLine = styled.div`
  position: absolute;
  width: 2px;
  height: calc(100% - 40px);
  background: ${theme.borderColor};
  left: 20px;
  top: 48px;
  z-index: 0;
`;

const ReplyingInfo = styled.div`
  color: ${theme.grayColor};
  font-size: 0.875rem;
  margin-top: 8px;
`;

const ReplyingActor = styled.span`
  color: ${theme.primaryColor};
  margin-left: 4px;
`;

const CommentSection = styled.div`
  margin-top: 15px;

  .comment-form {
    flex: 1;
    min-height: 100px; // Slightly reduced from 120px for compactness
  }
`;
