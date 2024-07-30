import React from "react";
import { Box, Image, Text } from "@chakra-ui/react";

import logo from "../assets/logo512.png";

const LoadingPage: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100vw"
      height="100vh"
      bg="gray.900"
    >
      <Box textAlign="center">
        <Image src={logo} alt="Loading" width="80px" height="80px" />
        <Text mt={1} color="white">
          Sparkler
        </Text>
      </Box>
    </Box>
  );
};

export default LoadingPage;
