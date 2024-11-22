import React, { useState } from "react";
import styled from "styled-components";
import { AvatarGroup, Button, Text } from "@chakra-ui/react";
import { NotificationActivity } from "getstream";
import { useNavigate } from "react-router-dom";
import { FiAtSign } from "react-icons/fi";

import { Activity } from "../../utils/types";
import { generateSparkleLink } from "../../utils/links";
import { SPARKLE_VERB } from "../../hooks/useSparkle";
import { useProfileUser } from "../../hooks";
import Avatar from "../Avatar";
import SparkleBlock from "../sparkle/SparkleBlock";

interface Props {
  activityGroup: NotificationActivity;
}

const MentionNotification: React.FC<Props> = ({ activityGroup }) => {
  const [showSparkles, setShowSparkles] = useState(false);
  const { viewUserProfile } = useProfileUser();
  const navigate = useNavigate();

  const { activities, activity_count, actor_count, verb } = activityGroup;
  const sparkles = activities as unknown as Activity[];
  const firstSparkle = sparkles[0];

  const getNoun = (): string => {
    let noun = "Sparkle";
    noun += activity_count > 1 ? "s" : "";
    return noun;
  };

  const generateLink = ({ actor, id }: Activity): string =>
    generateSparkleLink(actor.data.username, id);

  const viewMention = (sparkle: Activity) => navigate(generateLink(sparkle));

  const viewTheFirstSparkle = () => navigate(generateLink(firstSparkle));

  const viewFirstSparklerProfile = () => viewUserProfile(firstSparkle.actor);

  if (verb !== SPARKLE_VERB) return null;

  return (
    <Container>
      <FiAtSign size={25} color="var(--theme-color)" />

      <div className="right">
        {actor_count === 1 ? (
          <Avatar
            src={firstSparkle.actor.data.profileImage}
            name={firstSparkle.actor.data.name}
            onClick={() => viewMention(firstSparkle)}
          />
        ) : (
          <AvatarGroup>
            {sparkles.map((sparkle, index) => {
              const { name, profileImage } = sparkle.actor.data;

              return (
                <Avatar
                  key={index}
                  src={profileImage}
                  name={name}
                  onClick={() => viewMention(sparkle)}
                />
              );
            })}
          </AvatarGroup>
        )}

        <p className="actors__text">
          <span className="actors__name" onClick={viewFirstSparklerProfile}>
            {firstSparkle.actor.data.name}
          </span>

          <span>
            {actor_count > 1 &&
              ` and ${activity_count - 1} other${
                activity_count === 2 ? "" : "s"
              } `}
            {`_ mentioned you in ${getNoun()}`}
          </span>

          {!showSparkles && (
            <Text
              color="var(--gray-color)"
              cursor="pointer"
              fontStyle="italic"
              ml={1}
              mt={3}
              noOfLines={1}
              onClick={viewTheFirstSparkle}
            >
              "{firstSparkle.object.data.text}"
            </Text>
          )}

          <Button
            size="xs"
            my={3}
            ml={1}
            onClick={() => setShowSparkles(!showSparkles)}
          >
            {showSparkles ? `Hide ${getNoun()}` : `View ${getNoun()} here`}
          </Button>

          {showSparkles &&
            activities.map((sparkle) => (
              <SparkleBlock key={sparkle.id} activity={sparkle} />
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
