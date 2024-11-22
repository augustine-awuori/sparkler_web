import { Avatar } from "react-activity-feed";
import { Box } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { NotificationActivity } from "getstream";
import styled from "styled-components";

import { Activity } from "../../utils/types";
import { Heart } from "../../assets/icons";
import { useProfileUser } from "../../hooks";

interface Props {
  activityGroup: NotificationActivity;
}

export default function LikeNotification({ activityGroup }: Props) {
  const { viewUserProfile } = useProfileUser();
  const navigate = useNavigate();

  const { activities, is_seen } = activityGroup;
  const likedGroup: { [id: string]: Activity[] } = {};

  (activities as unknown as Activity[]).forEach((sparkle) => {
    if (sparkle.object.id in likedGroup) {
      likedGroup[sparkle.object.id].push(sparkle);
    } else likedGroup[sparkle.object.id] = [sparkle];
  });

  return (
    <>
      {Object.keys(likedGroup).map((groupKey) => {
        const sparkles = likedGroup[groupKey];
        const { actor, object } = sparkles[0];
        const link = `/${actor.data.username}/status/${object.id}`;

        return (
          <Block
            isSeen={is_seen}
            className="active"
            onClick={() => navigate(link)}
            key={groupKey}
          >
            <Heart color="var(--theme-color)" size={25} fill={true} />
            <div className="right">
              <div className="liked-actors__images">
                {sparkles.map(({ id, actor }) => (
                  <Box
                    key={id}
                    className="liked-actors__images__image"
                    onClick={() => viewUserProfile(actor)}
                  >
                    <Avatar image={actor.data.profileImage} alt="profile" />
                  </Box>
                ))}
              </div>
              <span className="liked-actors__text">
                <Link className="liked-actor__name" to={`/${actor.id}`}>
                  {actor.data.name}
                </Link>{" "}
                <Link to={link}>
                  {sparkles.length > 1 && `and ${sparkles.length - 1} others`}{" "}
                  liked your sparkle
                </Link>
              </span>

              <p className="tweet-text">{object.data?.text || ""}</p>
            </div>
          </Block>
        );
      })}
    </>
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

  span {
    display: inline-block;
  }

  .right {
    margin-left: 20px;
    flex: 1;
  }

  .liked-actors__images {
    display: flex;

    &__image {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .liked-actors__text {
    margin-top: 10px;
    color: white;
    font-size: 15px;

    .liked-actor__name {
      font-weight: bold;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .tweet-text {
    display: block;
    color: #888;
    margin-top: 10px;
  }
`;
