import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Box } from "@chakra-ui/react";

interface TabProps {
  children?: ReactNode;
  pathname: string;
  Icon: JSX.Element;
}

const BottomTab = ({ children, Icon: TabIcon, pathname }: TabProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname.startsWith(pathname);

  return (
    <Button
      onClick={() => navigate(pathname)}
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
    >
      <Box as="span" fontSize="xl" mb={1}>
        {TabIcon}
      </Box>
      {children}
    </Button>
  );
};

export default BottomTab;
