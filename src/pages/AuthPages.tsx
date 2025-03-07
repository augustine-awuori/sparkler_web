import { useEffect } from "react";
import { IoLogoGoogle } from "react-icons/io5";
import { TbNumber10Small } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useUser, useProfileUser } from "../hooks";
import auth from "../services/auth";

const theme = {
  primaryColor: "var(--primary-color)", // #1da1f2
  primaryHoverColor: "var(--primary-hover-color)", // #1a91da
  backgroundColor: "var(--background-color)", // #15202b
  borderColor: "var(--border-color)", // #38444d
  textColor: "var(--text-color)", // #fff
  grayColor: "var(--gray-color)", // #888888
};

const AuthPages = () => {
  const { viewUserProfile } = useProfileUser();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) viewUserProfile(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleGoogleSignIn = async () => await auth.loginWithGoogle();

  return (
    <Container>
      <AuthBox>
        <Title>Welcome to Sparkler</Title>

        <AuthButton onClick={handleGoogleSignIn} isPrimary={true}>
          <IconWrapper>
            <IoLogoGoogle />
          </IconWrapper>
          Continue with Google
        </AuthButton>

        <AuthButton onClick={() => navigate("/auth/code")} isPrimary={false}>
          <IconWrapper>
            <TbNumber10Small size={24} />
          </IconWrapper>
          Use Auth Code
        </AuthButton>
      </AuthBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: ${theme.textColor};
`;

const AuthBox = styled.div`
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  border: 1px solid ${theme.borderColor};
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin: 0 1rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  color: ${theme.textColor};
  margin-bottom: 2rem;
  font-family: "Quicksand", sans-serif;
`;

const AuthButton = styled.button<{ isPrimary: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.875rem 1rem;
  margin-bottom: ${(props) => (props.isPrimary ? "1rem" : "0")};
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  font-family: "Quicksand", sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) =>
    props.isPrimary ? theme.primaryColor : "transparent"};
  color: ${(props) => (props.isPrimary ? theme.textColor : theme.primaryColor)};
  border: ${(props) =>
    props.isPrimary ? "none" : `1px solid ${theme.primaryColor}`};

  &:hover {
    background: ${(props) =>
      props.isPrimary ? theme.primaryHoverColor : "rgba(29, 161, 242, 0.1)"};
    transform: translateY(-2px);
    ${(props) =>
      !props.isPrimary &&
      `color: ${theme.primaryHoverColor}; border-color: ${theme.primaryHoverColor};`}
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const IconWrapper = styled.span`
  margin-right: 0.75rem;
  display: flex;
  align-items: center;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export default AuthPages;
