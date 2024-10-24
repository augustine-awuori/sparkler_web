import styled from "styled-components";
import { useBreakpointValue } from "@chakra-ui/media-query";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button, ButtonProps } from "@chakra-ui/react";

import { logout } from "../../hooks/useAuth";
import { useUser } from "../../hooks";

const Btn = ({ children, ...otherProps }: ButtonProps) => (
  <Button
    size="sm"
    color="var(--conc-theme-color)"
    letterSpacing={0.1}
    colorScheme="var(--conc-theme-color)"
    py={0}
    my={0}
    {...otherProps}
  >
    {children}
  </Button>
);

export default function MainHeader() {
  const { user } = useUser();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();

  return (
    <Header>
      <h1>Home</h1>
      {user || (!user && !isMobile) ? (
        <Btn onClick={logout} leftIcon={<FaSignOutAlt />}>
          Log out
        </Btn>
      ) : (
        <Btn onClick={() => navigate("/auth")} leftIcon={<FaSignInAlt />}>
          Login
        </Btn>
      )}
    </Header>
  );
}

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 15px;
  color: white;
  width: 100%;
  font-weight: bold;
  justify-content: space-between;
  backdrop-filter: blur(2px);
  background-color: rgba(0, 0, 0, 0.5);

  h1 {
    font-size: 20px;
  }
`;
