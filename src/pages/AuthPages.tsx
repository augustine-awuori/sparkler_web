import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useUser } from "../hooks";
import auth from "../services/auth";
import LoginForm from "./LoginPage";
import RegisterForm from "./RegisterPage";

const AuthPages = () => {
  const [isLoggingIn, setIsLogginIn] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(`/${user.username}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleGoogleSignIn = async () => await auth.loginWithGoogle();

  return (
    <Container>
      {isLoggingIn ? (
        <LoginForm
          onSignUpRequest={() => setIsLogginIn(false)}
          onSignInWithGoogle={handleGoogleSignIn}
        />
      ) : (
        <RegisterForm
          onSignInRequest={() => setIsLogginIn(true)}
          onSignInWithGoogle={handleGoogleSignIn}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: black;
  color: white;
`;

export default AuthPages;
