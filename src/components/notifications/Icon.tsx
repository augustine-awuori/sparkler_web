import { useLocation } from "react-router-dom";
import styled from "styled-components";

import Bell from "../icons/Bell";
import useNewNotifications from "../../hooks/useNewNotifications";

const NotificationIcon = () => {
  const location = useLocation();
  const { newNotifications } = useNewNotifications();

  const isActiveLink = location.pathname === "/notifications";

  return (
    <Container>
      {!!newNotifications && (
        <span className="notifications-count">{newNotifications}</span>
      )}
      <Bell fill={isActiveLink} color="white" />
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
    top: -10px;
    right: -10px;
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
