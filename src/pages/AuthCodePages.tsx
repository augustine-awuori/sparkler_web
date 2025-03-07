import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function AuthCodePages() {
  const navigate = useNavigate();

  return (
    <Container>
      <AuthScreen>
        <Title>Welcome to Sparkler</Title>
        <Button onClick={() => navigate("login")}>Login</Button>
        <SecondaryButton onClick={() => navigate("regsiter")}>
          Register
        </SecondaryButton>
      </AuthScreen>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const AuthScreen = styled.div`
  padding: 2rem 3rem;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  border: 1px solid var(--blue-color);
`;

const Title = styled.h1`
  color: var(--text-color);
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.875rem;
  margin: 0.5rem 0;
  border-radius: 50px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--primary-color);
  color: var(--text-color);
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: var(--primary-hover-color);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);

  &:hover {
    background: rgba(29, 161, 242, 0.2);
    border-color: var(--primary-hover-color);
    color: var(--primary-hover-color);
  }
`;
