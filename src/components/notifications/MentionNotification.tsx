import React, { useState } from "react";
import styled from "styled-components";
import { AvatarGroup, Button, Text } from "@chakra-ui/react";
import { NotificationActivity } from "getstream";
import { useNavigate } from "react-router-dom";
import { FiAtSign } from "react-icons/fi";

import { Activity } from "../../utils/types";
import { generateSparkleLink } from "../../utils/links";
import { SPARKLE_VERB } from "../../hooks/useSparkle";
import { useProfile } from "../../hooks";
import Avatar from "../Avatar";
import SparkleBlock from "../sparkle/SparkleBlock";

interface Props {
  activityGroup: NotificationActivity;
}

const MentionNotification: React.FC<Props> = ({ activityGroup }) => {
  const [showSparkles, setShowSparkles] = useState(false);
  const { setUser } = useProfile();
  const navigate = useNavigate();

  if (activityGroup.verb !== SPARKLE_VERB) return null;

  const activities = activityGroup.activities as unknown as Activity[];

  const firstActivity = activityGroup.activities[0] as unknown as Activity;

  const generateActivityLink = (activity: Activity): string =>
    generateSparkleLink(activity.actor.data.username, activity.id);

  const viewMention = (activity: Activity) =>
    navigate(generateActivityLink(activity));

  const viewTheFirstSparkle = () =>
    navigate(generateActivityLink(firstActivity));

  const viewFirstActorProfile = () => {
    setUser(firstActivity.actor);
    navigate(`/${firstActivity.actor.data.username}`);
  };

  return (
    <Container>
      <FiAtSign size={25} color="var(--theme-color)" />
      <div className="right">
        <AvatarGroup>
          {activities.map((activity) => (
            <Avatar
              key={activity.id}
              src={activity.actor.data.profileImage}
              name={activity.actor.data.name}
              onClick={() => viewMention(activity)}
            />
          ))}
        </AvatarGroup>

        <p className="actors__text">
          <span className="actors__name" onClick={viewFirstActorProfile}>
            {firstActivity.actor.data.name + " "}
          </span>

          <span>
            {activityGroup.activity_count > 1 &&
              ` and ${activityGroup.activity_count - 1} other${
                activityGroup.activity_count === 2 ? "" : "s"
              } `}
            mentioned you in their sparkles
          </span>

          {!showSparkles && (
            <Text
              color="var(--gray-color)"
              cursor="pointer"
              fontStyle="italic"
              mt={3}
              noOfLines={1}
              onClick={viewTheFirstSparkle}
            >
              "{firstActivity.object.data.text}"
            </Text>
          )}

          <Button
            size="xs"
            my={3}
            onClick={() => setShowSparkles(!showSparkles)}
          >
            {showSparkles ? "Hide Sparkles" : "View Sparkles here"}
          </Button>

          {showSparkles &&
            activityGroup.activities.map((activity) => (
              <SparkleBlock activity={activity} />
            ))}
        </p>
      </div>
    </Container>
  );
};

const Container = styled.div`
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

export default MentionNotification;
