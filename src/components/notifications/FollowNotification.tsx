import { NotificationActivity } from "getstream";
import { AvatarGroup } from "@chakra-ui/react";
import styled from "styled-components";

import { Activity } from "../../utils/types";
import { useProfileUser } from "../../hooks";
import { User } from "../../assets/icons";
import Avatar from "../Avatar";

interface Props {
  activityGroup: NotificationActivity;
}

export default function FollowNotification({ activityGroup }: Props) {
  const { viewUserProfile } = useProfileUser();

  const { activities, activity_count, is_seen } = activityGroup;
  const firstSparkle = activities[0] as unknown as Activity;

  return (
    <Block isSeen={is_seen}>
      <User color="var(--theme-color)" size={25} />
      <div className="right">
        <AvatarGroup>
          {(activities as unknown as Activity[]).map(({ actor }, index) => (
            <Avatar
              key={index}
              name={actor.data.name}
              onClick={() => viewUserProfile(actor)}
              src={actor.data.profileImage}
            />
          ))}
        </AvatarGroup>

        <p className="actors__text">
          <span
            className="actors__name"
            onClick={() => viewUserProfile(firstSparkle.actor)}
          >
            {firstSparkle.actor.data.name}
          </span>
          <span>
            {activity_count > 1 &&
              `and ${activity_count - 1} other${
                activity_count === 2 ? "" : "s"
              } `}
            followed you
          </span>
        </p>
      </div>
    </Block>
  );
}

const Block = styled.div<{ isSeen: boolean }>`
  padding: 15px;
  border-bottom: 1px solid #333;
  display: flex;
  background-color: ${(props) =>
    props.isSeen ? "transparent" : "var(--light-gray)"};

  a {
    color: white;
  }

  .right {
    margin-left: 20px;
    flex: 1;
  }

  .actors__text {
    margin-top: 10px;
    color: white;
    font-size: 15px;

    span {
      display: inline-block;
    }

    .actors__name {
      font-weight: bold;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;
