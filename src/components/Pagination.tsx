import React from "react";
import styled from "styled-components";

interface PaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = (props) => {
  const { totalItems, pageSize, currentPage, onPageChange } = props;

  const totalPages = Math.ceil(totalItems / pageSize);

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages: (number | string)[] = [];

    if (totalPages <= maxPagesToShow)
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    else {
      const leftBound = Math.max(2, currentPage - 1);
      const rightBound = Math.min(totalPages - 1, currentPage + 1);

      pages.push(1);
      if (leftBound > 2) pages.push("...");

      for (let i = leftBound; i <= rightBound; i++) pages.push(i);

      if (rightBound < totalPages - 1) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalItems === 0) return null;

  return (
    <PaginationContainer>
      <PaginationButton
        $isDisabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </PaginationButton>

      {getPageNumbers().map((page, index) =>
        typeof page === "string" ? (
          <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>
        ) : (
          <PaginationButton
            key={page}
            $isActive={page === currentPage}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </PaginationButton>
        )
      )}

      <PaginationButton
        $isDisabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </PaginationButton>
    </PaginationContainer>
  );
};

export default Pagination;

const theme = {
  primaryColor: "var(--primary-color, #1da1f2)",
  primaryHoverColor: "var(--primary-hover-color, #1a91da)",
  backgroundColor: "var(--background-color, #15202b)",
  borderColor: "var(--border-color, #38444d)",
  textColor: "var(--text-color, #fff)",
  grayColor: "var(--gray-color, #888888)",
};

const PaginationContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
  max-width: 100%;
  box-sizing: border-box;
  justify-content: center; /* Center the pagination buttons horizontally */
`;

const PaginationButton = styled.button<{
  $isActive?: boolean;
  $isDisabled?: boolean;
}>`
  padding: 8px 16px;
  background: ${({ $isActive }) =>
    $isActive ? theme.primaryColor : "rgba(255, 255, 255, 0.1)"};
  border: 1px solid ${theme.borderColor};
  border-radius: 20px;
  color: ${({ $isActive }) => ($isActive ? "#fff" : theme.textColor)};
  font-size: 0.9rem;
  cursor: ${({ $isDisabled }) => ($isDisabled ? "not-allowed" : "pointer")};
  transition: background 0.2s ease, color 0.2s ease;
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.5 : 1)};

  &:hover {
    background: ${({ $isActive, $isDisabled }) =>
      $isDisabled
        ? "rgba(255, 255, 255, 0.1)"
        : $isActive
        ? theme.primaryHoverColor
        : "rgba(255, 255, 255, 0.2)"};
  }

  ${({ $isActive }) =>
    $isActive &&
    `
    border-color: ${theme.primaryColor};
    font-weight: bold;
  `}
`;

const Ellipsis = styled.span`
  padding: 8px 16px;
  color: ${theme.textColor};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
`;
