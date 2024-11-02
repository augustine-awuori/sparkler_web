import React, { useState } from "react";
import styled from "@emotion/styled";
import { FaFacebookF, FaTwitter, FaWhatsapp, FaCopy } from "react-icons/fa";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sparkleUrl: string;
  text?: string;
}

const SparkleShareModal: React.FC<Props> = ({
  isOpen,
  onClose,
  sparkleUrl,
  text,
}) => {
  const [copySuccess, setCopySuccess] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(sparkleUrl).then(() => {
      setCopySuccess("Link copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    });
  };

  const shareText = text ? encodeURIComponent(text) : "Check out this Sparkle!";

  if (!isOpen) return null;

  return (
    <Container>
      <div className="modal-backdrop">
        <div className="modal">
          <button onClick={onClose} className="close-button">
            ✕
          </button>
          <h3>Share this Sparkle</h3>

          <div className="share-options">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${sparkleUrl}&quote=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton>
                <FaFacebookF />
              </IconButton>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${sparkleUrl}&text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton>
                <FaTwitter />
              </IconButton>
            </a>
            <a
              href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(
                sparkleUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton>
                <FaWhatsapp />
              </IconButton>
            </a>
            <IconButton onClick={handleCopy}>
              <FaCopy />
            </IconButton>
            {copySuccess && <p className="copy-success">{copySuccess}</p>}
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .modal-backdrop {
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    height: 100vh;
    justify-content: center;
    left: 0;
    position: fixed;
    top: 0;
    width: 100vw;
  }

  .modal {
    background: #111;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    position: relative;
    width: 300px;
    color: #fff;
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 16px;
    background: none;
    border: none;
    color: #fff;
  }

  .share-options {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }

  .copy-success {
    color: #0f0;
    font-size: 14px;
    margin-top: 10px;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 24px;
  padding: 10px;
  transition: color 0.3s;

  &:hover {
    color: #1da1f2;
  }

  &:nth-of-type(1):hover {
    color: #3b5998; /* Facebook */
  }

  &:nth-of-type(2):hover {
    color: #1da1f2; /* Twitter */
  }

  &:nth-of-type(3):hover {
    color: #25d366; /* WhatsApp */
  }

  &:nth-of-type(4):hover {
    color: #0f0; /* Copy link */
  }
`;

export default SparkleShareModal;
