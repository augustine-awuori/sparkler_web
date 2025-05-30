import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormikHelpers } from "formik";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import * as Yup from "yup";
import styled from "styled-components";

import { DataError } from "../services/client";
import { Form, FormField, SubmitButton } from "../components/form";
import authService from "../services/auth";
import usersService from "../services/users";

const schema = Yup.object().shape({
  email: Yup.string().email().required().label("Email"),
  name: Yup.string().min(1).max(100).required().label("Name"),
  authCode: Yup.string().min(4).required().label("Auth Code"),
});

export type UserInfoWithCode = Yup.InferType<typeof schema>;

export default function AuthCodeRegister() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (): Promise<boolean> =>
    schema.isValid({ email, name: "temp", authCode: "1000" });

  const handleGetAuthCode = async () => {
    if (error) setError("");

    const isValidEmail = await validateEmail();
    if (!isValidEmail) return setError("Enter a valid email address");

    setLoading(true);
    try {
      const { ok } = await authService.getAuthCode(email);
      ok
        ? toast.success("Check your email for the Auth Code")
        : toast.error("Code couldn't be sent! Are you sure the email exists?");
    } catch (err) {
      setError("Failed to get auth code. Try again.");
    }
    setLoading(false);
  };

  const handleRegister = async (
    info: UserInfoWithCode,
    { resetForm }: FormikHelpers<UserInfoWithCode>
  ) => {
    if (error) setError("");
    setLoading(true);
    const { data, ok } = await usersService.registerWithCode(info);
    if (!ok) {
      setLoading(false);
      return setError(
        (data as DataError)?.error || "An unexpected error occurred."
      );
    }

    authService.loginWithJwt(data as string);
    setLoading(false);
    setEmail("");
    resetForm();
    window.location.href = "/";
  };

  return (
    <Container>
      <LoginScreen>
        <Title>Register</Title>
        <Form
          onSubmit={handleRegister}
          validationSchema={schema}
          initialValues={{ name: "", email: "", authCode: "" }}
        >
          <FormField name="name" placeholder="Name" disabled={loading} />

          <FormField
            name="email"
            placeholder="Email address"
            inputMode="email"
            onTextChange={setEmail}
            disabled={loading}
          />

          <AuthCodeLink onClick={handleGetAuthCode} disabled={loading}>
            {loading ? (
              <LoadingWrapper>
                <FaSpinner className="animate-spin" />
                <span>Sending...</span>
              </LoadingWrapper>
            ) : (
              "Press to get Auth code"
            )}
          </AuthCodeLink>

          <FormField
            name="authCode"
            placeholder="Enter auth code"
            inputMode="numeric"
            disabled={loading}
          />

          <SubmitButton
            title={loading ? "Processing..." : "Register"}
            disabled={loading}
          />
        </Form>
        <AuthCodeLink onClick={() => navigate("/auth/code/login")}>
          Have an account?
        </AuthCodeLink>
        {error && <ErrorText>{error}</ErrorText>}
      </LoginScreen>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const LoginScreen = styled.div`
  padding: 2rem 3rem;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  border: 1px solid var(--border-color);
`;

const Title = styled.h1`
  color: var(--text-color);
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
`;

const AuthCodeLink = styled.button<{ disabled?: boolean }>`
  background: none;
  border: none;
  color: ${(props) =>
    props.disabled ? "var(--gray-color)" : "var(--primary-color)"};
  font-size: 0.9rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  padding: 0.5rem 0;
  text-align: left;
  transition: color 0.2s ease;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover:not(:disabled) {
    color: var(--primary-hover-color);
    text-decoration: underline;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 1rem;
    height: 1rem;
    color: var(--primary-color);
  }

  span {
    color: var(--text-color);
  }
`;

const ErrorText = styled.div`
  color: var(--faded-theme-color); // Adjust if you add an error color
  font-size: 0.875rem;
  margin-top: 1rem;
  text-align: center;
`;
