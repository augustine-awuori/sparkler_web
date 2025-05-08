import React from "react";
import styled from "styled-components";

export default function Marketplace() {
  return (
    <Container>
      <Title>Marketplace is Coming Soon!</Title>
      <Message>
        We’re working hard to bring you an amazing marketplace experience. In
        the meantime, visit{" "}
        <Link
          href="https://soamazing.shop"
          target="_blank"
          rel="noopener noreferrer"
        >
          soamazing.shop
        </Link>{" "}
        for more information and business.
      </Message>
    </Container>
  );
}

const theme = {
  primaryColor: "var(--primary-color, #1da1f2)",
  primaryHoverColor: "var(--primary-hover-color, #1a91da)",
  backgroundColor: "var(--background-color, #15202b)",
  borderColor: "var(--border-color, #38444d)",
  textColor: "var(--text-color, #fff)",
  grayColor: "var(--gray-color, #888888)",
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* Full viewport height for centering */
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: ${theme.textColor};
  margin-bottom: 16px;
`;

const Message = styled.p`
  font-size: 1rem;
  color: ${theme.grayColor};
  line-height: 1.5;
  max-width: 600px;
`;

const Link = styled.a`
  color: ${theme.primaryColor};
  text-decoration: none;

  &:hover {
    color: ${theme.primaryHoverColor};
    text-decoration: underline;
  }
`;
