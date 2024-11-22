import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useProfileUser } from "../../hooks";
import verificationIcon from "../../assets/verified.svg";

interface Props {
  time: string;
  name: string;
  username: string;
  id: string;
  verified: boolean;
}

//TODO: pass the whole user data
export default function SparkleActorName({
  time,
  name,
  id,
  username,
  verified,
}: Props) {
  const navigate = useNavigate();
  const { setProfileUser: setUser } = useProfileUser();

  const timeDiff = Date.now() - new Date(time).getTime();
  const hoursBetweenDates = timeDiff / (60 * 60 * 1000);
  const lessThan24hrs = hoursBetweenDates < 24;
  const lessThan1hr = hoursBetweenDates < 1;

  const timeText = lessThan1hr
    ? `${Math.floor(timeDiff / (60 * 1000))}m`
    : lessThan24hrs
    ? `${Math.floor(hoursBetweenDates)}h`
    : format(new Date(time), "MMM d");

  const navigateToProfile = () => {
    navigate(`/${username}`);
    setUser({
      created_at: "",
      id,
      updated_at: "",
      duration: "",
      data: { time, name, id, username, verified },
    });
  };

  return (
    <TextBlock onClick={navigateToProfile}>
      <span className="user--name">{name}</span>
      {verified && (
        <img src={verificationIcon} alt="Verified" className="verified-icon" />
      )}
      <span className="user--id">@{username}</span>
      <span className="tweet-date">{timeText}</span>
    </TextBlock>
  );
}

const TextBlock = styled.div`
  display: flex;
  align-items: center;

  &:hover .user--name {
    text-decoration: underline;
  }

  .user {
    &--name {
      color: white;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 150px;
    }
    &--id {
      margin-left: 5px;
      color: #777;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 150px; /* Adjust as needed */
    }
  }

  .verified-icon {
    width: 16px; /* Adjust icon size as needed */
    height: 16px;
    margin-left: 5px;
  }

  .tweet-date {
    margin-left: 15px;
    color: #777;
    position: relative;

    &::after {
      content: "";
      width: 2px;
      height: 2px;
      background-color: #777;
      position: absolute;
      left: -8px;
      top: 0;
      bottom: 0;
      margin: auto 0;
    }
  }
`;
