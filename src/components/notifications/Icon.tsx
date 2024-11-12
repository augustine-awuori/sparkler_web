import { useLocation } from "react-router-dom";
import styled from "styled-components";

import { useNewNotifications } from "../../hooks";
import Bell from "../icons/Bell";

const NotificationIcon = () => {
  const { newNotifications } = useNewNotifications();
  const location = useLocation();

  const isActiveLink = location.pathname === "/notifications";

  return (
    <Container>
      {!!newNotifications && (
        <span className="notifications-count">{newNotifications}</span>
      )}
      <Bell
        fill={isActiveLink}
        color={isActiveLink ? "#fff" : "#9e9999"}
        size={23}
      />
    </Container>
  );
};

const Container = styled.div`
  position: relative; /* Ensure the container is the reference point for absolute positioning */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--icon-size);
  height: var(--icon-size);

  .notifications-count {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: var(--theme-color);
    color: white;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export default NotificationIcon;
