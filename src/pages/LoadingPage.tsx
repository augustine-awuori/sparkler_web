import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { LuWand } from "react-icons/lu";

const LoadingPage: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100vw"
      height="100vh"
      bg="black"
    >
      <Box
        textAlign="center"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <LuWand color="var(--theme-color)" size={55} />
        <Text mt={2} color="white" fontFamily="quicksand" letterSpacing={0.3}>
          Sparkler
        </Text>
      </Box>
    </Box>
  );
};

export default LoadingPage;
