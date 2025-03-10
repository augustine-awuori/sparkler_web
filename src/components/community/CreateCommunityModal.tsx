// components/CreateCommunityModal.tsx
import { useState } from "react";
import { Button, Input } from "@chakra-ui/react";
import styled from "styled-components";
import { toast } from "react-toastify";

export default function CreateCommunityModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, bio: string) => void;
}) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Community name is required");
      return;
    }
    onSubmit(name, bio);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>Create a New Community</ModalHeader>
        <FormGroup>
          <Label>Name</Label>
          <InputField
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter community name"
          />
        </FormGroup>
        <FormGroup>
          <Label>Bio</Label>
          <InputField
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Enter community bio"
          />
        </FormGroup>
        <ButtonGroup>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: var(--background-color, #15202b);
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  color: var(--text-color, #fff);
  border: 1px solid var(--border-color, #38444d);
`;

const ModalHeader = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 15px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 5px;
  color: var(--gray-color, #888888);
`;

const InputField = styled(Input)`
  width: 100%;
  padding: 8px;
  border-radius: 20px;
  border: 1px solid var(--border-color, #38444d);
  background: transparent;
  color: var(--text-color, #fff);
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: var(--primary-color, #1da1f2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const SubmitButton = styled(Button)`
  padding: 8px 16px;
  background: var(--primary-color, #1da1f2);
  color: var(--text-color, #fff);
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-hover-color, #1a91da);
  }
`;

const CancelButton = styled(Button)`
  padding: 8px 16px;
  background: transparent;
  color: var(--gray-color, #888888);
  border: 1px solid var(--border-color, #38444d);
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;
