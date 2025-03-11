import { Box } from "@chakra-ui/react";

import { Home, Mail, Search } from "../../assets/icons";
import { useUnreadMessages, useUser } from "../../hooks";
import BottomTab from "./BottomTab";
import NotificationIcon from "../notifications/Icon";

const BottomNav = () => {
  const { count } = useUnreadMessages();
  const { user } = useUser();

  const getPathName = (path: string) => (user ? path : "/auth");

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
    </Box>
  );
};

export default BottomNav;
