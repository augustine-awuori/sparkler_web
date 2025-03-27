import { useNavigate } from "react-router-dom";
import { Gallery } from "react-activity-feed";
import styled from "styled-components";

export type Report = {
  _id: string;
  images: string[];
  title: string;
  description: string;
  seen: boolean;
};

export default function Card(report: Report) {
  const navigate = useNavigate();
  const { _id, images, title, description, seen } = report;

  return (
    <CardWrapper seen={seen} onClick={() => navigate(_id)}>
      <ContentWrapper>
        <Title>{title}</Title>
        <Description>{description}</Description>
        {images.length > 0 && (
          <Gallery
            images={images}
            style={{ border: "none", borderRadius: 15 }}
          />
        )}
        <Status seen={seen}>{seen ? "Seen" : "Unseen"}</Status>
      </ContentWrapper>
    </CardWrapper>
  );
}

const CardWrapper = styled.div<{ seen: boolean }>`
  background-color: ${({ seen }) =>
    seen
      ? "transparent"
      : "var(--background-color)"}; /* #15202b if unseen, transparent if seen */
  border: 1px solid var(--border-color); /* #38444d */
  border-radius: 0.75rem; /* Rounded corners like X.com */
  cursor: pointer;
  margin-bottom: 1rem;
  overflow: hidden;
  color: var(--text-color); /* #fff */
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--primary-hover-color); /* #1a91da */
  }
`;

const ContentWrapper = styled.div`
  padding: 0 1rem; /* Horizontal padding */
`;

const Title = styled.h2`
  font-size: 1.125rem; /* 18px */
  font-weight: 700;
  margin: 1rem 0 0.5rem;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; /* Add ellipsis for overflow */
`;

const Description = styled.p`
  font-size: 0.9375rem; /* 15px, matches X.com's tweet text */
  color: var(--text-color); /* #fff */
  margin: 0 0 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limit to 3 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; /* Add ellipsis for overflow */
`;

const Status = styled.span<{ seen: boolean }>`
  font-size: 0.875rem; /* 14px */
  color: ${({ seen }) =>
    seen
      ? "var(--gray-color)"
      : "var(--primary-color)"}; /* #888888 if seen, #1da1f2 if unseen */
  margin-bottom: 1rem;
  display: block;
`;
