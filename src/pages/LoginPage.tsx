import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Box, Heading } from "@chakra-ui/react";

import { z } from "zod";

import { ResponseError } from "../services/client";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/form";
import { useForm } from "../hooks";
import auth from "../services/auth";
import service from "../services/users";
import Text from "../components/Text";

const schema = z.object({
  email: z.string().email().min(7).max(70),
  password: z.string().min(1).max(150),
});

export type LoginInfo = z.infer<typeof schema>;

interface Props {
  onSignUpRequest: () => void;
}

const LoginForm = ({ onSignUpRequest }: Props) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { errors, handleSubmit, register } = useForm(schema);
  const navigate = useNavigate();

  const doSubmit = async (info: LoginInfo) => {
    try {
      if (error) setError("");
      setLoading(true);
      const { data, ok, problem } = await service.login(info);
      setLoading(false);

      if (ok) {
        auth.loginWithJwt(data as string);
        navigate("/");
      } else {
        setError(problem);
        toast.error("Login failed");
      }
    } catch (error) {
      setError(
        (error as ResponseError).response?.data?.error || "unknown error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading as="h2" size="xl" textAlign="center" mb={6}>
        Sign in to Sparkler
      </Heading>

      <Form handleSubmit={handleSubmit} onSubmit={doSubmit}>
        <ErrorMessage error={error} visible />
        <FormField register={register} error={errors.email} label="Email" />
        <FormField
          error={errors.password}
          label="Password"
          type="password"
          placeholder="*******"
          register={register}
        />
        <SubmitButton label="Sign In" isLoading={loading} />
        <Text cursor="pointer" textAlign="center" onClick={onSignUpRequest}>
          Don't have an account? Sign Up
        </Text>
      </Form>
    </Box>
  );
};

export default LoginForm;
