import { useNavigate } from "react-router-dom";
import { NotificationActivity } from "getstream";
import styled from "styled-components";

import { Activity } from "../../utils/types";
import { Comment } from "../../assets/icons";
import { generateSparkleLink } from "../../utils/links";
import { useProfileUser } from "../../hooks";
import Avatar from "../Avatar";
import SparkleActorName from "../sparkle/SparkleActorName";

export interface CommentNotificationActivity extends NotificationActivity {
  replyTo: string;
  time: string;
  text: string;
}

interface Props {
  activityGroup: NotificationActivity;
}

export default function CommentNotification({ activityGroup }: Props) {
  const { viewUserProfile } = useProfileUser();
  const navigate = useNavigate();

  const { actor, time, object } = activityGroup
    .activities[0] as unknown as Activity;
  const sparkleLink = generateSparkleLink(actor.id, object.id);

  return (
    <Block onClick={() => navigate(sparkleLink)}>
      <Comment color="#1c9bef" size={25} />
      <div className="right">
        <Avatar
          onClick={() => viewUserProfile(actor)}
          src={actor.data.profileImage}
          name={actor.data.name}
        />
        <div className="user__details">
          <SparkleActorName
            id={actor.id}
            name={actor.data.name}
            time={time}
            verified={Boolean(actor.data.verified)}
            username={actor.data.username}
          />
          <span className="user__reply-to">
            Replying to{" "}
            <div onClick={() => viewUserProfile(actor)}>
              @{actor.data.username}
            </div>
            <p className="user__text">{object.data?.text}</p>
          </span>
        </div>
      </div>
    </Block>
  );
}

const Block = styled.button`
  padding: 15px;
  border-bottom: 1px solid #333;
  display: flex;

  a {
    color: white;
  }

  .user__image {
    width: 35px;
    height: 35px;
    overflow: hidden;
    border-radius: 50%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .user__details {
    margin-left: 20px;
    flex: 1;
  }

  .user__reply-to {
    color: #555;
    font-size: 15px;
    margin-top: 3px;

    a {
      color: var(--theme-color);
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .right {
    margin-left: 20px;
    flex: 1;
  }

  .user__text {
    display: block;
    color: white;
    margin-top: 10px;
  }
`;
