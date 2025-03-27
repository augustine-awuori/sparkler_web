import styled from "styled-components";

export type Report = {
  _id: string;
  images: string[];
  title: string;
  description: string;
  seen: boolean;
};

export default function Card({ images, title, description, seen }: Report) {
  return (
    <CardWrapper>
      <ContentWrapper>
        <Title>{title}</Title>
        <Description>{description}</Description>
        {images.length > 0 && (
          <ImageContainer>
            {images.map((src, index) => (
              <StyledImage
                key={index}
                src={src}
                alt={`Report image ${index + 1}`}
              />
            ))}
          </ImageContainer>
        )}
        <Status seen={seen}>{seen ? "Seen" : "Unseen"}</Status>
      </ContentWrapper>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  background-color: var(--background-color); /* #15202b */
  border: 1px solid var(--border-color); /* #38444d */
  border-radius: 0.75rem; /* Rounded corners like X.com */
  margin-bottom: 1rem;
  overflow: hidden;
  color: var(--text-color); /* #fff */
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--primary-hover-color); /* #1a91da */
  }
`;

const ContentWrapper = styled.div`
  padding: 0 1rem; /* Horizontal padding as requested */
`;

const Title = styled.h2`
  font-size: 1.125rem; /* 18px */
  font-weight: 700;
  margin: 1rem 0 0.5rem;
  line-height: 1.2;
`;

const Description = styled.p`
  font-size: 0.9375rem; /* 15px, matches X.com's tweet text */
  color: var(--text-color); /* #fff */
  margin: 0 0 1rem;
  word-wrap: break-word;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StyledImage = styled.img`
  width: 100%;
  max-width: 150px; /* Constrain image size */
  height: auto;
  border-radius: 0.5rem;
  object-fit: cover;
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
