import React from "react";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import styled from "styled-components";

type UserAccountsProps = {
  user: {
    data: {
      instagram?: string;
      youtube?: string;
      tiktok?: string;
    };
  };
};

const UserAccounts: React.FC<UserAccountsProps> = ({ user }) => {
  const { instagram, youtube, tiktok } = user.data;

  const accounts = [
    { link: youtube, icon: FaYoutube },
    { link: tiktok, icon: FaTiktok },
    { link: instagram, icon: FaInstagram },
  ];

  return (
    <AccountContainer>
      {accounts.map(
        (account, index) =>
          account.link && (
            <a
              href={account.link}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
            >
              <div className="account-link">
                <account.icon size={10} />
              </div>
            </a>
          )
      )}
    </AccountContainer>
  );
};

const AccountContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;

  .account-link {
    background-color: #fff;
    padding: 8px;
    border-radius: 50%;
    transition: background-color 0.3s, transform 0.3s ease;

    &:hover {
      background-color: var(--theme-color);
      transform: translateY(-2px);
    }

    &:active {
      background-color: #1a91d1;
      transform: translateY(0);
    }
  }
`;

export default UserAccounts;
