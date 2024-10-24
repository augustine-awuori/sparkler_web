import styled from "styled-components";
import { useBreakpointValue } from "@chakra-ui/media-query";
import { FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { Button } from "@chakra-ui/react";
import { useUser } from "../../hooks";
import Sparkler from "../icons/Twitter";

export default function MainHeader() {
  const { user } = useUser();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();

  return (
    <Header>
      <h1>Home</h1>
      {user || (!user && !isMobile) ? (
        <Sparkler color="white" />
      ) : (
        <Button
          size="sm"
          color="var(--conc-theme-color)"
          letterSpacing={0.1}
          colorScheme="var(--conc-theme-color)"
          onClick={() => navigate("/auth")}
          leftIcon={<FaSignInAlt />}
        >
          Login
        </Button>
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
