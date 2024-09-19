import styled from "styled-components";
import classNames from "classnames";

import Search from "../icons/Search";

interface Props {
  query: string;
  onQueryChange: (query: string) => void;
}

const SearchInput = ({ onQueryChange, query }: Props) => (
  <SearchContainer>
    <Search color="#fff" />
    <input
      onChange={(e) => onQueryChange(e.target.value)}
      value={query}
      placeholder="Search Sparkler"
      style={{ color: "#fff" }}
    />
    <button
      className={classNames(!Boolean(query) && "hide", "submit-btn")}
      type="button"
      onClick={() => onQueryChange("")}
    >
      X
    </button>
  </SearchContainer>
);

const SearchContainer = styled.div`
  background-color: #333;
  border-radius: 20px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  input {
    border: none;
    outline: none;
    background-color: transparent;
    flex-grow: 1;
    margin-left: 8px;
    color: #fff; /* Text color */
  }

  .submit-btn {
    border: none;
    background: none;
    cursor: pointer;
    color: #fff; /* Text color */
  }

  .hide {
    display: none;
  }
`;

export default SearchInput;
