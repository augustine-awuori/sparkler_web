import React, { useState } from "react";
import styled from "styled-components";

import { QuoteForm } from "../components/resparkle";
import { useActivity, useResparkle } from "../hooks";
import Layout from "../components/Layout";
import Header from "../components/Header";

const QuoteSparklePage: React.FC = () => {
  const [quote, setQuote] = useState("");
  const { toggleResparkle: toggleSparkle } = useResparkle();
  const { activity } = useActivity();

  const handleQuoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setQuote(e.target.value);

  const handleQuoteSubmit = () => {
    // Handle quote submission logic (e.g., API call)
    console.log("Quote submitted:", quote);
    // if (activity) toggleSparkle(activity, quote);
  };

  return (
    <Layout>
      <Container>
        <Header title="Quote Sparkle" />
        <QuoteForm
          quote={quote}
          onQuoteChange={handleQuoteChange}
          onQuoteSubmit={handleQuoteSubmit}
        />
      </Container>
    </Layout>
  );
};

export default QuoteSparklePage;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;
