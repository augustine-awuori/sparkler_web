import { useNavigate } from "react-router-dom";
import { NotificationActivity } from "getstream";
import { AvatarGroup } from "@chakra-ui/react";
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

  const { activities, actor_count, is_seen } = activityGroup;
  const sparkles = activities as unknown as Activity[];
  const { actor, time, object } = sparkles[0];
  const sparkleLink = generateSparkleLink(actor.data.username, object.id);

  return (
    <Block onClick={() => navigate(sparkleLink)} isSeen={is_seen}>
      <Comment color="#1c9bef" size={25} />

      <div className="right">
        {actor_count === 1 ? (
          <Avatar
            src={actor.data.profileImage}
            name={actor.data.name}
            onClick={() => navigate(sparkleLink)}
          />
        ) : (
          <AvatarGroup>
            {sparkles.map((sparkle, index) => {
              const { name, profileImage, username } = sparkle.actor.data;

              return (
                <Avatar
                  key={index}
                  src={profileImage}
                  name={name}
                  onClick={() =>
                    navigate(generateSparkleLink(username, sparkle.id))
                  }
                />
              );
            })}
          </AvatarGroup>
        )}

        <div className="user__details">
          <SparkleActorName time={time} {...actor.data} />
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

const Block = styled.button<{ isSeen: boolean }>`
  padding: 15px;
  border-bottom: 1px solid #333;
  display: flex;
  background-color: ${(props) =>
    props.isSeen ? "transparent" : "var(--light-gray)"};

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
