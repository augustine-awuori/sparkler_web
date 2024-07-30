import styled from "styled-components";
import { Activity as MainActivity } from "getstream";

import { Activity, ActivityActor } from "../../utils/types";
import { formatStringWithLink } from "../../utils/string";
import Modal from "../Modal";
import SparkleActorName from "./SparkleActorName";
import SparkleForm from "./SparkleForm";

interface Props {
  activity: MainActivity;
  onClickOutside: () => void;
  onPostComment: (comment: string) => Promise<void>;
}

export default function CommentDialog({
  activity,
  onPostComment,
  onClickOutside,
}: Props) {
  const {
    object: { data: sparkle },
  } = activity as unknown as Activity;

  const sparkleActor = activity.actor as unknown as ActivityActor;

  const onSubmit = async (text: string) => {
    await onPostComment(text);

    onClickOutside();
  };

  return (
    <Container>
      <Modal onClickOutside={onClickOutside} className="modal-block">
        <BlockContent>
          <div className="tweet">
            <div className="img">
              <img src={sparkleActor.data.profileImage} alt="" />
            </div>
            <div className="details">
              <SparkleActorName
                time={activity.time}
                name={sparkleActor.data.name}
                username={sparkleActor.data.username}
                id={sparkleActor.data.id}
              />
              <p
                className="tweet-text"
                dangerouslySetInnerHTML={{
                  __html: formatStringWithLink(
                    sparkle.text,
                    "tweet__text--link",
                    true
                  ).replace(/\n/g, "<br/>"),
                }}
              />
              <div className="replying-info">
                Replying to{" "}
                <span className="replying-info--actor">
                  @{sparkleActor.data.username}
                </span>
              </div>
            </div>
          </div>
          <div className="comment">
            <SparkleForm
              className="comment-form"
              submitText="Reply"
              placeholder="Sparkle your reply"
              onSubmit={onSubmit}
              shouldFocus
            />
          </div>
        </BlockContent>
      </Modal>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  .modal-block {
    padding: 15px;
    width: 100%;
    max-width: 800px; /* Optional: Set a max-width if you want to limit the maximum size */
    height: max-content;
  }
`;

const BlockContent = styled.div`
  .tweet {
    margin-top: 30px;
    display: flex;
    position: relative;
    width: 100%;

    &::after {
      content: "";
      background-color: #444;
      width: 2px;
      height: calc(100% - 35px);
      position: absolute;
      left: 20px;
      z-index: 0;
      top: 45px;
    }

    .img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 15px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .details {
      width: calc(100% - 55px); /* Adjust based on img width and margin */

      .actor-name {
        font-size: 15px;
        &--name {
          color: white;
          font-weight: bold;
        }

        &--id {
          color: #888;
        }
      }

      .tweet-text {
        color: white;
        margin-top: 3px;
        font-size: 14px;
      }

      .replying-info {
        color: #555;
        display: flex;
        margin-top: 20px;
        font-size: 14px;

        &--actor {
          margin-left: 5px;
          color: var(--theme-color);
        }
      }
    }
  }

  .comment {
    display: flex;
    margin-top: 20px;
    width: 100%;

    .img {
      width: 35px;
      height: 35px;
      margin-left: 3px;
      border-radius: 50%;
      margin-right: 15px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .comment-form {
      flex: 1;
      height: 120px;
    }
  }
`;
