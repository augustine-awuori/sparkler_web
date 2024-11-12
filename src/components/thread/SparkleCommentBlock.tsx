import { Avatar } from "react-activity-feed";
import styled from "styled-components";

import { Comment } from "../../utils/types";
import { formatStringWithLink } from "../../utils/string";
import { More } from "../../assets/icons";
import SparkleActorName from "../sparkle/SparkleActorName";

interface Props {
  comment: Comment;
}

export default function SparkleCommentBlock({ comment }: Props) {
  const { user, data: tweetComment } = comment;

  return (
    <Block>
      <figure className="user-image">
        {user.data.profileImage ? (
          <img src={user.data.profileImage} alt="profile" />
        ) : (
          <Avatar />
        )}
      </figure>
      <div className="comment-tweet">
        <div>
          <SparkleActorName
            verified={Boolean(user.data.verified)}
            name={user.data.name}
            username={user.data.username}
            id={user.id}
            time={comment.created_at}
          />
          <div className="tweet__details">
            <p
              className="comment-tweet__text"
              dangerouslySetInnerHTML={{
                __html: formatStringWithLink(
                  tweetComment.text,
                  "tweet__text--link"
                ).replace(/\n/g, "<br/>"),
              }}
            />
          </div>
        </div>
      </div>
      <button className="more">
        <More size={18} color="white" />
      </button>
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  border-bottom: 1px solid #333;
  padding: 15px 0;

  .user-image {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 15px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .comment-tweet {
    flex: 1;
    .link {
      display: block;
      padding-bottom: 5px;
      text-decoration: none;
    }

    &__text {
      color: white;
      font-size: 15px;
      line-height: 20px;
      margin-top: 3px;

      &--link {
        color: var(--theme-color);
        text-decoration: none;
      }
    }
  }

  .more {
    width: 30px;
    height: 20px;
    display: flex;
    opacity: 0.6;
  }
`;
