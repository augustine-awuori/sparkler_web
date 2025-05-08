import React from "react";
import styled from "styled-components";

import { Product } from "../../hooks/useProducts";

type ProductCardProps = {
  product: Product;
  onClick?: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <Card>
      <Image src={product.images[0] || "/placeholder.jpg"} alt={product.name} />
      <Title>{product.name}</Title>
      <SubTitle>
        {product.shop?.name} • by {product.author.name}
      </SubTitle>
      <Description>{product.description}</Description>
      <BottomRow>
        <Price>Ksh {product.price.toFixed(2)}</Price>
        <Button onClick={onClick}>View Details</Button>
      </BottomRow>
    </Card>
  );
};

const Card = styled.div`
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  padding: 12px;
  width: 100%;
  max-width: 280px; /* Reduced from 360px */
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 160px; /* Reduced from 200px */
  border-radius: 12px;
  object-fit: cover;
`;

const Title = styled.h2`
  font-size: 1rem; /* Reduced from 1.25rem */
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary || "#fff"};
  margin: 8px 0 2px; /* Reduced from 12px 0 4px */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SubTitle = styled.p`
  font-size: 0.75rem; /* Reduced from 0.875rem */
  color: ${({ theme }) => theme.textSecondary || "#666"};
  margin-bottom: 4px; /* Reduced from 8px */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Description = styled.p`
  font-size: 0.75rem; /* Reduced from 0.875rem */
  color: ${({ theme }) => theme.textSecondary || "#555"};
  margin-bottom: 8px; /* Reduced from 16px */
  display: -webkit-box;
  -webkit-line-clamp: 1; /* Changed from 2 lines to 1 */
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.span`
  font-size: 0.875rem; /* Reduced from 1rem */
  font-weight: bold;
  color: #16a34a;
`;

const Button = styled.button`
  padding: 4px 8px; /* Reduced from 6px 12px */
  font-size: 0.75rem; /* Reduced from 0.875rem */
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 6px; /* Slightly reduced from 8px */
  cursor: pointer;

  &:hover {
    background-color: #1d4ed8;
  }
`;

export default ProductCard;
