import React from "react";
import styled from "styled-components";
import { Flex, Image } from "@chakra-ui/react";
import { Activity, DefaultGenerics } from "getstream";
import { useNavigate } from "react-router-dom";

import { Activity as AppActivity } from "../../utils/types";
import { formatStringWithLink } from "../../utils/string";
import SparkleActorName from "../sparkle/SparkleActorName";

interface Props {
  activity: Activity<DefaultGenerics>;
}

const EmbeddedSparkleBlock: React.FC<Props> = ({ activity }) => {
  const navigate = useNavigate();

  const appActivity = activity as unknown as AppActivity;
  const actor = appActivity.actor;
  const sparkle = appActivity.object.data;

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
          <Image
            src={actor.data.profileImage || "https://picsum.photos/500/300"}
            alt="profile"
          />
        </figure>
        <SparkleActorName
          name={actor.data.name}
          id={actor.id}
          username={actor.data.username}
          time={activity.time}
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

  .tweet {
    flex: 1;

    &__texts {
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
  }
`;
