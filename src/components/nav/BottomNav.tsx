import { Box } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

import { useUnreadMessages, useUser } from "../../hooks";
import BottomTab from "./BottomTab";
import Hashtag from "../icons/Hashtag";
import Home from "../icons/Home";
import Mail from "../icons/Mail";
import NotificationIcon from "../notifications/Icon";
import User from "../icons/User";

const BottomNav = () => {
  const { user } = useUser();
  const { count } = useUnreadMessages();
  const location = useLocation();

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg="black"
      display={{ base: "flex", md: "none" }}
      justifyContent="space-around"
      px={2}
      py={1}
      borderTop="1px solid #333"
      zIndex="10"
    >
      <BottomTab
        Icon={<Home color="#fff" fill={isCurrentPath("/")} size={23} />}
        pathname="/"
      />
      <BottomTab
        Icon={<Hashtag color="#fff" size={23} />}
        pathname="/explore"
      />
      <BottomTab Icon={<NotificationIcon />} pathname="/notifications" />
      <BottomTab
        Icon={<Mail color="#fff" size={23} />}
        pathname={user ? "/messages" : "/auth"}
        value={count}
      />
      <BottomTab
        Icon={
          <User size={23} color="#fff" fill={isCurrentPath(`/${user?._id}`)} />
        }
        pathname={user ? `/${user?.username}` : "/auth"}
      />
    </Box>
  );
};

export default BottomNav;
