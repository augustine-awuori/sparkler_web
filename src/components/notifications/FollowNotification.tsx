import { Link, useNavigate } from "react-router-dom";
import { NotificationActivity } from "getstream";
import { AvatarGroup } from "@chakra-ui/react";
import styled from "styled-components";

import { Activity } from "../../utils/types";
import Avatar from "../Avatar";
import User from "../icons/User";

interface Props {
  followActivities: NotificationActivity;
}

export default function FollowNotification({ followActivities }: Props) {
  const navigate = useNavigate();
  const firstActivity = followActivities.activities[0] as unknown as Activity;
  const activitiesCount = followActivities.activities.length;

  return (
    <Block>
      <User color="#1c9bef" size={25} />
      <div className="right">
        <AvatarGroup>
          {(followActivities.activities as unknown as Activity[]).map(
            (activity) => (
              <Avatar
                key={activity.id}
                name={activity.actor.data.name}
                onClick={() => navigate(`/${activity.actor.id}`)}
                src={activity.actor.data.profileImage}
              />
            )
          )}
        </AvatarGroup>

        <p className="actors__text">
          <Link className="actors__name" to={`/${firstActivity.actor.id}`}>
            {firstActivity.actor.data.name}
          </Link>{" "}
          <span>
            {activitiesCount > 1 &&
              `and ${activitiesCount - 1} other${
                activitiesCount === 2 ? "" : "s"
              }`}{" "}
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
