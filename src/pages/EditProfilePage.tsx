import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useStreamContext } from "react-activity-feed";
import { toast } from "react-toastify";

import { ActivityActor, randomImageUrl } from "../utils/types";

const EditProfilePage: React.FC = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(randomImageUrl);
  const { client } = useStreamContext();
  const navigate = useNavigate();

  useEffect(() => {
    const { name, bio, profileImage } = (
      client?.currentUser as unknown as ActivityActor
    )?.data;
    setName(name);
    if (bio) setBio(bio);
    if (profileImage) setProfileImage(profileImage);
  }, [client?.currentUser]);

  const handleSave = async () => {
    const info = (client?.currentUser as unknown as ActivityActor)?.data;

    toast.loading("Saving your profile info...");
    await client?.currentUser?.update({ ...info, name, bio });
    toast.dismiss();

    navigate(-1);
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate(-1)}>&larr;</BackButton>
        <Title>Edit Profile</Title>
        <SaveButton onClick={handleSave}>Save</SaveButton>
      </Header>

      <Banner>
        <img src={randomImageUrl} alt="banner" />
      </Banner>

      <ProfilePicture>
        <img src={profileImage} alt="profile" />
      </ProfilePicture>

      <Form>
        <FormControl>
          <Label>Name</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Label>Bio</Label>
          <TextArea value={bio} onChange={(e) => setBio(e.target.value)} />
        </FormControl>
      </Form>
    </PageContainer>
  );
};

export default EditProfilePage;

const PageContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  border-radius: 8px;
`;

const Header = styled.header`
  align-items: center;
  backdrop-filter: blur(2px);
  background-color: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid #e1e8ed;
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 16px 10px;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const BackButton = styled.button`
  font-size: 24px;
  color: var(--theme-color);
  border: none;
  background: none;
  cursor: pointer;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
  color: #fff;
`;

const SaveButton = styled.button`
  padding: 6px 16px;
  background-color: var(--theme-color);
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: var(--conc-theme-color);
  }
`;

const Banner = styled.div`
  width: 100%;
  height: 150px;
  background-color: #e1e8ed;
  margin-top: 0;
  overflow: hidden;

  img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }
`;

const ProfilePicture = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #e1e8ed;
  border: 4px solid #ffffff;
  overflow: hidden;
  position: relative;
  top: -36px;
  left: 16px;

  img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }
`;

const Form = styled.form`
  padding: 1px 16px;
`;

const FormControl = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #657786;
`;

const Input = styled.input`
  background-color: inherit;
  border-radius: 4px;
  border: 1px solid var(--theme-color);
  color: #fff;
  font-size: 16px;
  padding: 12px;
  width: 100%;
`;

const TextArea = styled.textarea`
  background-color: inherit;
  border-radius: 4px;
  border: 1px solid var(--theme-color);
  color: #fff;
  font-size: 16px;
  padding: 12px;
  resize: vertical;
  width: 100%;
`;
