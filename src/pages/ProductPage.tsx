import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

import { ProfileHeader } from "../components/profile";
import { useProduct, useProducts, useUser } from "../hooks";
import LoadingIndicator from "../components/LoadingIndicator";

export default function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [orderMessage, setOrderMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const { product } = useProduct();
  const { orderProduct } = useProducts();
  const { user } = useUser();

  if (!product) return <LoadingIndicator />;

  const currentImage = selectedImage || product.images[0] || "/placeholder.jpg";

  const handlePlaceOrder = () => {
    if (!user)
      return toast.info(
        "Please login first! The buyer needs to know who's buying"
      );

    if (!phoneNumber.trim()) return setPhoneError("Phone number is required.");

    const phoneRegex = /^\+?\d{9,15}$/;
    if (!phoneRegex.test(phoneNumber))
      return setPhoneError("Please enter a valid phone number (9-15 digits).");

    setPhoneError("");
    orderProduct(product, { message: orderMessage, phoneNumber });
    setOrderMessage("");
    setPhoneNumber("");
  };

  return (
    <Container>
      <ProfileHeader showCoverImage={false} subtitle={product.name} />

      <ImageSection>
        <MainImage src={currentImage} alt={product.name} />
        {product.images.length > 0 && (
          <ThumbnailContainer>
            {product.images.map((image, index) => (
              <Thumbnail
                key={index}
                src={image}
                alt={`${product.name} ${index + 1}`}
                $isSelected={image === currentImage}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </ThumbnailContainer>
        )}
      </ImageSection>
      <DetailsSection>
        <Title>{product.name}</Title>
        <SubTitle>
          {product.shop?.name ? `${product.shop.name} • ` : ""}by{" "}
          {product.author.name}
        </SubTitle>
        <Price>Ksh {product.price.toFixed(2)}</Price>
        <Description>{product.description}</Description>
        <Type>Type: {product.type.label}</Type>
        <PhoneLabel>
          Phone Number: <Required>*</Required>
        </PhoneLabel>
        <PhoneInput
          type="tel"
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value);
            setPhoneError(""); // Clear error on input change
          }}
          placeholder="Enter your phone number (e.g., +254123456789) for contact"
          required
        />
        {phoneError && <ErrorMessage>{phoneError}</ErrorMessage>}
        <MessageLabel>Optional Message:</MessageLabel>
        <MessageTextarea
          value={orderMessage}
          onChange={(e) => setOrderMessage(e.target.value)}
          placeholder="Add a message for the seller (optional)"
        />
        <ActionButton onClick={handlePlaceOrder}>Place Order</ActionButton>
      </DetailsSection>
      <FooterMessage>
        Payments are not done in-app or online but in-person. If you don’t like
        the product on delivery, just don’t pay. Price is negotiable with the
        buyer, so it isn’t always what’s shown. Delivery and payment are handled
        by a startup e-commerce called Amazing at{" "}
        <a
          href="https://soamazing.shop"
          target="_blank"
          rel="noopener noreferrer"
        >
          soamazing.shop
        </a>{" "}
        for more.
      </FooterMessage>
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
  flex-wrap: wrap;
  gap: 20px;
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  box-sizing: border-box;
`;

const ImageSection = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MainImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: thin;
  scrollbar-color: ${theme.grayColor} transparent;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${theme.grayColor};
    border-radius: 3px;
  }
`;

const Thumbnail = styled.img<{ $isSelected: boolean }>`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid
    ${({ $isSelected }) => ($isSelected ? theme.primaryColor : "transparent")};
  transition: border 0.2s ease;

  &:hover {
    border: 2px solid ${theme.primaryHoverColor};
  }
`;

const DetailsSection = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${theme.textColor};
  margin: 0;
`;

const SubTitle = styled.p`
  font-size: 0.9rem;
  color: ${theme.grayColor};
  margin: 0;
`;

const Price = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
  color: #16a34a;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: ${theme.textColor};
  line-height: 1.5;
`;

const Type = styled.p`
  font-size: 0.9rem;
  color: ${theme.grayColor};
  margin: 0;
`;

const PhoneLabel = styled.label`
  font-size: 0.9rem;
  color: ${theme.textColor};
  margin-top: 8px;
`;

const Required = styled.span`
  color: #ff4d4f; // Red to indicate required field
`;

const PhoneInput = styled.input`
  width: 100%;
  padding: 8px;
  font-size: 0.9rem;
  color: ${theme.textColor};
  background: rgba(255, 255, 255, 0.1); // Matches MessageTextarea
  border: 1px solid ${theme.borderColor};
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${theme.primaryColor};
  }

  &::placeholder {
    color: ${theme.grayColor};
  }
`;

const ErrorMessage = styled.p`
  font-size: 0.8rem;
  color: #ff4d4f; // Red for error
  margin: 4px 0 0;
`;

const MessageLabel = styled.label`
  font-size: 0.9rem;
  color: ${theme.textColor};
  margin-top: 8px;
`;

const MessageTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 8px;
  font-size: 0.9rem;
  color: ${theme.textColor};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${theme.borderColor};
  border-radius: 8px;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${theme.primaryColor};
  }

  &::placeholder {
    color: ${theme.grayColor};
  }
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background: ${theme.primaryColor};
  border: 1px solid ${theme.borderColor};
  border-radius: 20px;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;
  font-weight: bold;
  align-self: flex-start;

  &:hover {
    background: ${theme.primaryHoverColor};
  }
`;

const FooterMessage = styled.footer`
  width: 100%;
  margin-top: 20px;
  font-size: 0.85rem;
  color: ${theme.grayColor};
  text-align: center;
  line-height: 1.5;

  a {
    color: ${theme.primaryColor};
    text-decoration: none;

    &:hover {
      color: ${theme.primaryHoverColor};
      text-decoration: underline;
    }
  }
`;
