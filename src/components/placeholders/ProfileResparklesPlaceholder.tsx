import { Flex, Heading, Text } from "@chakra-ui/react";

const ProfileResparklesPlaceholder = () => (
  <Flex
    direction="column"
    align="center"
    justify="center"
    height="100vh"
    bg="inherit"
    p={4}
  >
    <Heading fontWeight={800} textAlign="center" mb={4} color="white">
      No Resparkles Yet
    </Heading>
    <Text fontSize="lg" textAlign="center" color="gray.500" mb={2}>
      Spread the joy by resparkling interesting content!
    </Text>
    <Text fontSize="md" textAlign="center" color="gray.500">
      Resparkle posts you love and share them with your followers.
    </Text>
    <Text fontSize="sm" textAlign="center" color="gray.400" mt={4}>
      Great content deserves to be shared!
    </Text>
  </Flex>
);

export default ProfileResparklesPlaceholder;
