import { useState } from "react";
import { toast } from "react-toastify";
import { Box, Button, Heading } from "@chakra-ui/react";
import { z } from "zod";
import { IoLogoGoogle } from "react-icons/io5";

import { ResponseError } from "../services/client";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/form";
import { events, logEvent } from "../storage/analytics";
import { useForm } from "../hooks";
import { User } from "../users";
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
  onSignInWithGoogle: () => void;
}

const LoginForm = ({ onSignUpRequest, onSignInWithGoogle }: Props) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { errors, handleSubmit, register } = useForm(schema);

  const doSubmit = async (info: LoginInfo) => {
    try {
      if (error) setError("");
      setLoading(true);
      const { data, ok, problem } = await service.login(info);
      setLoading(false);

      if (ok) {
        auth.loginWithJwt(data as string);
        logEvent(events.userInteraction.LOGIN, {
          userId: (data as User)._id,
        });
        window.location.href = "/";
      } else {
        setError(problem);
        toast.error("Login failed");
      }
    } catch (error) {
      setLoading(false);
      setError(
        (error as ResponseError).response?.data?.error || "unknown error"
      );
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      p={6}
      borderWidth={1}
      borderRadius="lg"
      fontFamily="quicksand"
      boxShadow="lg"
    >
      <Heading
        as="h2"
        size="lg"
        textAlign="center"
        mb={6}
        fontFamily="quicksand"
      >
        Sign in to Sparkler
      </Heading>

      <Form handleSubmit={handleSubmit} onSubmit={doSubmit}>
        <Button
          leftIcon={<IoLogoGoogle />}
          colorScheme="pink"
          variant="outline"
          mb={1}
          width="full"
          onClick={onSignInWithGoogle}
        >
          Sign in with Google
        </Button>
        <Text textAlign="center">or</Text>

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
      </Form>

      <Text
        cursor="pointer"
        textAlign="center"
        mt={4}
        onClick={onSignUpRequest}
      >
        Don't have an account? Sign Up
      </Text>
    </Box>
  );
};

export default LoginForm;
