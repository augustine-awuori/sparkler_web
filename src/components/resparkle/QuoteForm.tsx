import React from "react";
import styled from "styled-components";
import { Button } from "@chakra-ui/react";
import { BsSend } from "react-icons/bs";
import { Navigate } from "react-router-dom";

import { useActivity, useUser } from "../../hooks";
import Avatar from "../Avatar";
import EmbeddedSparkleBlock from "./EmbeddedSparkleBlock";
import TextArea from "../TextArea";
import TextProgressRing from "../TextProgressRing";

interface QuoteFormProps {
  onQuoteChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onQuoteSubmit: () => Promise<void>;
  quote: string;
  sendingQuote: boolean;
}

const QuoteForm: React.FC<QuoteFormProps> = (props) => {
  const { activity } = useActivity();
  const { user } = useUser();

  const { onQuoteChange, onQuoteSubmit, quote, sendingQuote } = props;

  if (!activity) return <Navigate to="/" />;

  return (
    <FormContainer>
      <InputContainer>
        <Avatar size="sm" name={user?.name} src={user?.profileImage} />
        <section>
          <article>
            <TextArea
              placeholder="Add your comment..."
              value={quote}
              onChange={onQuoteChange}
            />
            <EmbeddedSparkleBlock activity={activity} />
            <article className="progress-ring">
              <TextProgressRing textLength={quote.length} />
              {Boolean(quote.length) && <hr className="divider" />}
              <Button
                onClick={onQuoteSubmit}
                size="sm"
                bg="var(--theme-color)"
                color="#fff"
                _hover={{ bg: "var(--primary-color)" }}
                rightIcon={<BsSend />}
                isLoading={sendingQuote}
                disabled={sendingQuote}
              >
                Quote
              </Button>
            </article>
          </article>
        </section>
      </InputContainer>
    </FormContainer>
  );
};

export default QuoteForm;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  .progress-ring {
    margin-left: auto;
    display: flex;
    align-items: center;
    margin-top: 1rem;
  }
`;

const InputContainer = styled.div`
  align-items: flex-start;
  display: flex;

  .divider {
    height: 30px;
    width: 2px;
    border: none;
    background-color: #444;
    border-radius: 5px;
    margin: 0 15px;
  }
`;
