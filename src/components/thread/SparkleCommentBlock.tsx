import styled from "styled-components";

import { formatStringWithLink } from "../../utils/string";
import More from "../icons/More";
import SparkleActorName from "../sparkle/SparkleActorName";

const Block = styled.div`
  display: flex;
  border-bottom: 1px solid #333;
  padding: 15px 0;

  .user-image {
    width: 40px;
    height: 40px;
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

interface Props {
  comment: {
    user: { data: { image: string; name: string }; id: string };
    created_at: string;
    data: { text: string };
  };
}

export default function SparkleCommentBlock({ comment }: Props) {
  const { user, data: tweetComment } = comment;
  console.log("comment", comment);
  return (
    <Block
    //   to="/"
    >
      <div className="user-image">
        <img src={user.data.image} alt="" />
      </div>
      <div className="comment-tweet">
        <div>
          <SparkleActorName
            name={user.data.name}
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
