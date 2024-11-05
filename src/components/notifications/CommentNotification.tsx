import { Link, useNavigate } from "react-router-dom";
import { useStreamContext } from "react-activity-feed";
import { NotificationActivity } from "getstream";
import styled from "styled-components";

import { Activity, ActivityActor } from "../../utils/types";
import { generateSparkleLink } from "../../utils/links";
import { useProfile } from "../../hooks";
import Avatar from "../Avatar";
import Comment from "../icons/Comment";
import SparkleActorName from "../sparkle/SparkleActorName";

export interface CommentNotificationActivity extends NotificationActivity {
  replyTo: string;
  time: string;
  text: string;
}

interface Props {
  activity: NotificationActivity;
}

export default function CommentNotification({ activity }: Props) {
  const { actor, time, object } = activity.activities[0] as unknown as Activity;
  const { setUser } = useProfile();
  const { user } = useStreamContext();
  const navigate = useNavigate();

  const sparkleLink = generateSparkleLink(actor.id, object.id);

  const visitProfile = (actor: ActivityActor) => {
    navigate(`/${actor.data.username}`);
    setUser(actor);
  };

  return (
    <Block key={activity.id} onClick={() => navigate(sparkleLink)}>
      <Comment color="#1c9bef" size={25} />
      <div className="right">
        <Avatar
          onClick={() => visitProfile(actor)}
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
            <Link to={`/${user?.id}`}>@{user?.data?.username as string}</Link>
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
