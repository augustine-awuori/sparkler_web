import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Box } from "@chakra-ui/react";
import { logEvent } from "../../storage/analytics";

interface TabProps {
  children?: ReactNode;
  pathname: string;
  Icon: JSX.Element;
  value?: number;
}

const BottomTab = ({ children, Icon: TabIcon, pathname, value }: TabProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname.startsWith(pathname);

  const handleNavigation = () => {
    logEvent("page_view", { pageLink: pathname });
    navigate(pathname);
  };

  return (
    <Button
      onClick={handleNavigation}
      bg="transparent"
      color={isActive ? "blue.500" : "gray.500"}
      _hover={{ bg: "transparent", color: "blue.600" }}
      _focus={{ boxShadow: "none" }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      w="full"
      h="full"
      p={2}
      position="relative"
    >
      <Box as="span" fontSize="xl" mb={1}>
        {TabIcon}
      </Box>
      {value ? (
        <Box
          position="absolute"
          top="1"
          right="7"
          fontSize="10px"
          bg="var(--theme-color)"
          color="white"
          borderRadius="full"
          px={2}
          py={1}
          minW="20px"
          textAlign="center"
        >
          {value}
        </Box>
      ) : null}
      {children}
    </Button>
  );
};

export default BottomTab;
