import { Flex, Heading, Text } from "@chakra-ui/react";

const SparklesPlaceholder = () => (
  <Flex
    direction="column"
    align="center"
    justify="center"
    height="100vh"
    bg="inherit"
    p={4}
    pt={0}
  >
    <Heading
      fontWeight={800}
      textAlign="center"
      mb={4}
      color="white"
      fontFamily="quicksand"
    >
      No Sparkles Yet
    </Heading>
    <Text fontSize="lg" textAlign="center" color="gray.500" mb={2}>
      It’s time to share your thoughts with the world!
    </Text>
    <Text fontSize="md" textAlign="center" color="gray.500">
      Start sparkling and let your followers know what you’re up to.
    </Text>
    <Text fontSize="sm" textAlign="center" color="gray.400" mt={4}>
      Don’t be shy, your ideas matter!
    </Text>
  </Flex>
);

export default SparklesPlaceholder;
