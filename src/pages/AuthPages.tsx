import { useEffect } from "react";
import { IoLogoGoogle } from "react-icons/io5";
import { Box, Button, Heading } from "@chakra-ui/react";
import styled from "styled-components";

import { useUser, useProfileUser } from "../hooks";
import auth from "../services/auth";

const AuthPages = () => {
  const { viewUserProfile } = useProfileUser();
  const { user } = useUser();

  useEffect(() => {
    if (user) viewUserProfile(user);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleGoogleSignIn = async () => await auth.loginWithGoogle();

  return (
    <Container>
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
          Welcome to Sparkler
        </Heading>

        <Button
          leftIcon={<IoLogoGoogle />}
          colorScheme="pink"
          variant="outline"
          mb={1}
          width="full"
          onClick={handleGoogleSignIn}
        >
          Continue with Google
        </Button>
      </Box>
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
