import { useState } from "react";
import styled from "styled-components";
import LoginForm from "./LoginPage";
import RegisterForm from "./RegisterPage";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: black;
  color: white;
`;

const AuthPages = () => {
  const [isLoggingIn, setIsLogginIn] = useState(true);

  return (
    <Container>
      {isLoggingIn ? (
        <LoginForm onSignUpRequest={() => setIsLogginIn(false)} />
      ) : (
        <RegisterForm onSignInRequest={() => setIsLogginIn(true)} />
      )}
    </Container>
  );
};

export default AuthPages;
