import { useNavigate } from "react-router-dom";
import { NotificationActivity } from "getstream";
import { AvatarGroup } from "@chakra-ui/react";
import styled from "styled-components";

import { Activity, ActivityActor } from "../../utils/types";
import { useProfile } from "../../hooks";
import { User } from "../../assets/icons";
import Avatar from "../Avatar";

interface Props {
  followActivities: NotificationActivity;
}

export default function FollowNotification({ followActivities }: Props) {
  const { setUser } = useProfile();
  const navigate = useNavigate();

  const firstActivity = followActivities.activities[0] as unknown as Activity;
  const activitiesCount = followActivities.activity_count;

  const visitProfile = (actor: ActivityActor) => {
    navigate(`/${actor.data.username}`);
    setUser(actor);
  };

  return (
    <Block>
      <User color="var(--theme-color)" size={25} />
      <div className="right">
        <AvatarGroup>
          {(followActivities.activities as unknown as Activity[]).map(
            (activity) => (
              <Avatar
                key={activity.id}
                name={activity.actor.data.name}
                onClick={() => visitProfile(activity.actor)}
                src={activity.actor.data.profileImage}
              />
            )
          )}
        </AvatarGroup>

        <p className="actors__text">
          <span
            className="actors__name"
            onClick={() => visitProfile(firstActivity.actor)}
          >
            {firstActivity.actor.data.name}
          </span>
          <span>
            {followActivities.activity_count > 1 &&
              `and ${activitiesCount - 1} other${
                activitiesCount === 2 ? "" : "s"
              } `}
            followed you
          </span>
        </p>
      </div>
    </Block>
  );
}

const Block = styled.div`
  padding: 15px;
  border-bottom: 1px solid #333;
  display: flex;

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
