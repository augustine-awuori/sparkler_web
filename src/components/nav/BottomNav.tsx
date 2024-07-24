import { Box } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

import { useUser } from "../../hooks";
import BottomTab from "./BottomTab";
import Discover from "../icons/Discover";
import Group from "../icons/Group";
import Home from "../icons/Home";
import NotificationIcon from "../notifications/Icon";
import User from "../icons/User";

const BottomNav = () => {
  const { user } = useUser();
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
      p={2}
      borderTop="1px solid #333"
      zIndex="10"
    >
      <BottomTab
        Icon={<Home color="#fff" fill={isCurrentPath("/")} />}
        pathname="/"
      />
      <BottomTab Icon={<Discover color="#fff" />} pathname="/" />
      <BottomTab Icon={<Group color="#fff" />} pathname="/" />
      <BottomTab Icon={<NotificationIcon />} pathname="/notifications" />
      <BottomTab
        Icon={<User color="#fff" fill={isCurrentPath(`/${user?._id}`)} />}
        pathname={`/${user?._id}`}
      />
    </Box>
  );
};

export default BottomNav;
