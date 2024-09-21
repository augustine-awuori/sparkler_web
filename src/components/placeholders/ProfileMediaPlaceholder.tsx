import { Flex, Heading, Text } from "@chakra-ui/react";

const ProfileMediaPlaceholder = () => (
  <Flex
    direction="column"
    align="center"
    justify="center"
    height="100vh"
    bg="inherit"
    px={4}
  >
    <Heading
      fontWeight={800}
      textAlign="center"
      mb={4}
      color="white"
      fontFamily="quicksand"
    >
      No Media Uploaded
    </Heading>
    <Text fontSize="lg" textAlign="center" color="gray.500" mb={2}>
      Share your photos and videos with the community!
    </Text>
    <Text fontSize="md" textAlign="center" color="gray.500">
      Upload your favorite moments and let your followers see the world through
      your eyes.
    </Text>
    <Text fontSize="sm" textAlign="center" color="gray.400" mt={4}>
      Capture, upload, and share your story!
    </Text>
  </Flex>
);

export default ProfileMediaPlaceholder;
