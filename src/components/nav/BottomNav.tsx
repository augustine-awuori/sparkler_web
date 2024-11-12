import { Box } from "@chakra-ui/react";

import { getProfileUserDataFromUserInfo } from "../../utils/funcs";
import { useProfile, useUnreadMessages, useUser } from "../../hooks";
import BottomTab from "./BottomTab";
import Home from "../icons/Home";
import Mail from "../icons/Mail";
import NotificationIcon from "../notifications/Icon";
import Search from "../icons/Search";
import User from "../icons/User";

const BottomNav = () => {
  const { count } = useUnreadMessages();
  const { setUser } = useProfile();
  const { user } = useUser();

  const getPathName = (path: string) => (user ? path : "/auth");

  const handleProfileUserData = () => {
    if (user) setUser(getProfileUserDataFromUserInfo(user));
  };

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
      <BottomTab Icon={Home} pathname="/" />
      <BottomTab Icon={Search} pathname="/explore" />
      <BottomTab
        Icon={NotificationIcon}
        pathname={getPathName("/notifications")}
      />
      <BottomTab
        Icon={Mail}
        pathname={getPathName("/messages")}
        value={count}
      />
      <BottomTab
        Icon={User}
        pathname={getPathName(`/${user?.username}`)}
        onClick={handleProfileUserData}
      />
    </Box>
  );
};

export default BottomNav;
