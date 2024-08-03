import styled from "styled-components";
import { Activity as MainActivity } from "getstream";
import { useState } from "react";

import { Activity, ActivityActor } from "../../utils/types";
import { QuoteForm } from "../resparkle";
import Modal from "../Modal";

interface Props {
  activity: MainActivity;
  onClose: () => void;
  onQuoteSubmit: (quote: string) => Promise<void>;
}

export default function QuoteDialog({
  activity,
  onQuoteSubmit,
  onClose,
}: Props) {
  const [quote, setQuote] = useState("");

  const {
    object: { data: sparkle },
  } = activity as unknown as Activity;

  const sparkleActor = activity.actor as unknown as ActivityActor;

  const handleQuoteSubmit = async () => {
    await onQuoteSubmit(quote);

    onClose();
  };

  const handleQuoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setQuote(e.target.value);

  return (
    <MainContainer>
      <Modal onClickOutside={onClose} className="modal-block">
        <BlockContent>
          {/* <Container> */}
          <QuoteForm
            quote={quote}
            onQuoteChange={handleQuoteChange}
            onQuoteSubmit={handleQuoteSubmit}
          />
          {/* </Container> */}
        </BlockContent>
      </Modal>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: center;

  .modal-block {
    padding: 15px;
    width: 100%;
    height: max-content;
  }
`;

const BlockContent = styled.div`
  .tweet {
    margin-top: 30px;
    display: flex;
    position: relative;
    width: 100%;

    &::after {
      content: "";
      background-color: #444;
      width: 2px;
      height: calc(100% - 35px);
      position: absolute;
      left: 20px;
      z-index: 0;
      top: 45px;
    }

    .img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 15px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .details {
      width: calc(100% - 55px);

      .actor-name {
        font-size: 15px;
        &--name {
          color: white;
          font-weight: bold;
        }

        &--id {
          color: #888;
        }
      }

      .tweet-text {
        color: white;
        margin-top: 3px;
        font-size: 14px;
      }

      .replying-info {
        color: #555;
        display: flex;
        margin-top: 20px;
        font-size: 14px;

        &--actor {
          margin-left: 5px;
          color: var(--theme-color);
        }
      }
    }
  }

  .comment {
    display: flex;
    margin-top: 20px;
    width: 100%;

    .img {
      width: 35px;
      height: 35px;
      margin-left: 3px;
      border-radius: 50%;
      margin-right: 15px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .comment-form {
      flex: 1;
      height: 120px;
    }
  }
`;
