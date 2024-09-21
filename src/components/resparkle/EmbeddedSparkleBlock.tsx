import React from "react";
import styled from "styled-components";
import { Avatar } from "react-activity-feed";
import { Flex, Image, Text } from "@chakra-ui/react";
import { Activity, DefaultGenerics } from "getstream";
import { useNavigate } from "react-router-dom";

import { Activity as AppActivity } from "../../utils/types";
import { formatStringWithLink } from "../../utils/string";
import SparkleActorName from "../sparkle/SparkleActorName";

// Define the type for reaction counts
interface ReactionCounts {
  comment?: number;
  like?: number;
  resparkle?: number;
  quote?: number;
}

interface Props {
  activity: Activity<DefaultGenerics>;
}

const EmbeddedSparkleBlock: React.FC<Props> = ({ activity }) => {
  const navigate = useNavigate();

  const appActivity = activity as unknown as AppActivity;
  const actor = appActivity.actor;
  const sparkle = appActivity.object.data;

  // Extract reaction counts with proper typing
  const reactionCounts: ReactionCounts = activity.reaction_counts || {};
  const { comment = 0, like = 0, resparkle = 0, quote = 0 } = reactionCounts;

  const handleNavigation = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    navigate(`/${actor.data.username}/status/${activity.id}`);
  };

  return (
    <EmbeddedBlock>
      <Flex fontSize="small">
        <figure className="embedded-user-image">
          {actor.data.profileImage ? (
            <Image src={actor.data.profileImage} alt="profile" />
          ) : (
            <Avatar />
          )}
        </figure>
        <SparkleActorName
          name={actor.data.name}
          id={actor.id}
          username={actor.data.username}
          time={activity.time}
          verified={Boolean(actor.data.verified)}
        />
      </Flex>
      <div className="tweet__details" onClick={handleNavigation}>
        <p
          className="tweet__texts"
          dangerouslySetInnerHTML={{
            __html: formatStringWithLink(
              sparkle.text,
              "tweet__text--link"
            ).replace(/\n/g, "<br/>"),
          }}
        />
      </div>
      <ReactionCountsComp>
        {comment > 0 && (
          <Text>
            {comment} Comment{comment > 1 ? "s" : ""}
          </Text>
        )}
        {like > 0 && (
          <Text>
            {like} Like{like > 1 ? "s" : ""}
          </Text>
        )}
        {resparkle > 0 && (
          <Text>
            {resparkle} Resparkle{resparkle > 1 ? "s" : ""}
          </Text>
        )}
        {quote > 0 && (
          <Text>
            {quote} Quote{quote > 1 ? "s" : ""}
          </Text>
        )}
      </ReactionCountsComp>
    </EmbeddedBlock>
  );
};

export default EmbeddedSparkleBlock;

const EmbeddedBlock = styled.div`
  border: 0.5px solid #777;
  border-radius: 8px;
  padding: 7px 10px;
  background-color: inherit;
  margin-bottom: 5px;
  cursor: pointer;

  .embedded-user-image {
    width: 18px;
    height: 18px;
    min-width: 18px;
    min-height: 18px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 5px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .tweet__details {
    margin-top: 5px;
  }

  .tweet__texts {
    color: #fff;
    font-size: 15px;
    line-height: 20px;
    margin-top: 3px;
    width: 100%;

    &--link {
      color: var(--theme-color);
      text-decoration: none;
    }
  }
`;

const ReactionCountsComp = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #aaa;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;
