import { useState } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { Box, Button, Heading } from "@chakra-ui/react";
import { IoLogoGoogle } from "react-icons/io5";

import {
  authTokenKey,
  DataError,
  processResponse,
  ResponseError,
} from "../services/client";
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
  name: z.string().min(3, "Name must be at least 3 characters").max(70),
  password: z
    .string()
    .min(4, "Password should be at least 1 character")
    .max(150),
});

export type RegistrationInfo = z.infer<typeof schema>;

interface Props {
  onSignInWithGoogle: () => void;
  onSignInRequest: () => void;
}

const RegisterForm = ({ onSignInRequest, onSignInWithGoogle }: Props) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { errors, handleSubmit, register } = useForm(schema);

  const doSubmit = async (info: RegistrationInfo) => {
    try {
      if (error) setError("");
      setLoading(true);
      const res = await service.register(info);
      setLoading(false);

      const { data, ok } = processResponse(res);
      if (ok) {
        auth.loginWithJwt(res?.headers[authTokenKey]);
        logEvent(events.userInteraction.SIGN_UP, {
          userId: (data as User)._id,
        });
        window.location.href = `/${(data as User).username}`;
      } else {
        setError((data as DataError).error || "Unknown error");
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
        as="h1"
        size="lg"
        textAlign="center"
        mb={6}
        fontFamily="quicksand"
      >
        Sign Up to Sparkler
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
          Sign up with Google
        </Button>
        <Text textAlign="center">or</Text>

        <ErrorMessage error={error} visible />
        <FormField register={register} error={errors.email} label="Email" />
        <FormField register={register} error={errors.name} label="Name" />
        <FormField
          error={errors.password}
          label="Password"
          type="password"
          placeholder="*******"
          register={register}
        />
        <SubmitButton label="Sign Up" isLoading={loading} />
        <Text
          cursor="pointer"
          textAlign="center"
          onClick={onSignInRequest}
          mt={3}
        >
          Have an account? Sign In
        </Text>
      </Form>
    </Box>
  );
};

export default RegisterForm;
