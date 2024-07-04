import styled from "styled-components";
import { Activity as MainActivity } from "getstream";

import { formatStringWithLink } from "../../utils/string";
import Modal from "../Modal";
import TweetActorName from "./SparkleActorName";
import TweetForm from "./SparkleForm";

const Container = styled.div`
  .modal-block {
    padding: 15px;
    width: 600px;
    height: max-content;
  }
`;

const BlockContent = styled.div`
  .tweet {
    margin-top: 30px;
    display: flex;
    position: relative;

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
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .details {
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

    .img {
      width: 35px;
      height: 35px;
      margin-left: 3px;
      border-radius: 50%;
      margin-right: 15px;
      border-radius: 50%;
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

export interface ActivityActor {
  created_at: string;
  data: { profileImage: string; name: string; id: string; email: string };
  id: string;
  updated_at: string;
}

export interface ActivityObject {
  collection: string;
  created_at: string;
  data: { text: string };
  foreign_id: string;
  id: string;
  updated_at: string;
}

export type Activity = {
  id: string;
  actor: ActivityActor;
  object: ActivityObject;
  time: string;
  own_reactions: {
    like: {
      activity_id: string;
      children_counts: object;
      created_at: string;
      data: object;
      id: string;
      kind: "like";
      latest_children: object;
      parent: string;
      updated_at: string;
      user: {
        created_at: string;
        updated_at: string;
        id: string;
        data: { email: string; name: string; profileImage?: string };
      };
      user_id: string;
    }[];
  };
  reaction_counts: { comment?: number; like?: number };
  target: string;
  verb: string;
};

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

  const tweetActor = (activity as unknown as Activity).actor;

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
              <img src={tweetActor.data.profileImage} alt="" />
            </div>
            <div className="details">
              <TweetActorName
                time={activity.time}
                name={tweetActor.data.name}
                id={tweetActor.data.id}
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
                <span className="replying-info--actor">@{tweetActor.id}</span>
              </div>
            </div>
          </div>
          <div className="comment">
            <TweetForm
              className="comment-form"
              submitText="Reply"
              placeholder="Tweet your reply"
              onSubmit={onSubmit}
              shouldFocus={true}
            />
          </div>
        </BlockContent>
      </Modal>
    </Container>
  );
}
