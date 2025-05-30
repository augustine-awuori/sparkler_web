import React, { useState } from "react";
import styled from "styled-components";
import { Activity } from "getstream";
import { useNavigate } from "react-router-dom";

import { QuoteForm } from "../components/resparkle";
import { useActivity, useComment } from "../hooks";
import Header from "../components/Header";
import { toast } from "react-toastify";

const QuoteSparklePage: React.FC = () => {
  const [quote, setQuote] = useState("");
  const { activity } = useActivity();
  const { createComment } = useComment();
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleQuoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setQuote(e.target.value);

  const handleQuoteSubmit = async () => {
    if (isLoading) return;

    setLoading(true);
    toast.loading("Sending your sparkle quote...");
    await createComment(quote, activity as unknown as Activity, "quote");
    toast.dismiss();
    toast.success("Quote sent");
    setLoading(false);

    navigate(-1);
  };

  return (
    <Container>
      <Header title="Quote Sparkle" />
      <QuoteForm
        quote={quote}
        onQuoteChange={handleQuoteChange}
        onQuoteSubmit={handleQuoteSubmit}
        sendingQuote={isLoading}
      />
    </Container>
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
