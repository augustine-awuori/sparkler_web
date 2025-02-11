import { useEffect } from "react";
import { Activity } from "getstream";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { EmbeddedSparkleBlock } from "../components/resparkle";
import { useActivity, useQuotes } from "../hooks";
import Avatar from "../components/Avatar";
import SparkleActorName from "../components/sparkle/SparkleActorName";
import Header from "../components/Header";

const QuotesPage = () => {
  const { quotes } = useQuotes();
  const { activity } = useActivity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!activity || !quotes.length) navigate(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity, quotes.length]);

  return (
    <Box>
      <Header title="Quotes" />
      <div style={{ width: "100%" }}>
        {quotes.map(({ id, user, created_at, data }) => {
          const { name, username, profileImage } = user.data;

          return (
            <Flex
              key={id}
              p={3}
              borderBottom="0.25px solid #777"
              minW="100%"
              cursor="pointer"
              _hover={{ bg: "#111" }}
              width="100%"
              onClick={() => navigate(`/${username}/status/${id}`)}
            >
              <Avatar src={profileImage} name={name} size="sm" mr={2} mt={1} />
              <Box width="100%">
                <SparkleActorName {...user.data} time={created_at} />
                <Text mb={1.5} color="#fff">
                  {data.text}
                </Text>
                <EmbeddedSparkleBlock
                  activity={activity as unknown as Activity}
                />
              </Box>
            </Flex>
          );
        })}
      </div>
    </Box>
  );
};

export default QuotesPage;
