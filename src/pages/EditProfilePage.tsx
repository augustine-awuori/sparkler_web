import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useStreamContext } from "react-activity-feed";
import { toast } from "react-toastify";

import { ActivityActor } from "../utils/types";
import service from "../services/users";
import storage from "../storage/files";

const EditProfilePage: React.FC = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [youtube, setYoutube] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [instagram, setInstagram] = useState("");
  const [customLink, setCustomLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | string>("");
  const [coverImage, setCoverImage] = useState<File | string>("");
  const { client } = useStreamContext();
  const navigate = useNavigate();

  useEffect(() => {
    const emptyUserInfo = {
      name: "",
      bio: "",
      profileImage: "",
      coverImage: "",
      youtube: "",
      tiktok: "",
      instagram: "",
      customLink: "",
    };

    function initUserInfo() {
      const {
        name,
        bio,
        profileImage,
        coverImage,
        youtube,
        linkedIn: tiktok,
        instagram,
        customLink,
      } = (client?.currentUser as unknown as ActivityActor)?.data ||
      emptyUserInfo;

      setName(name);
      if (bio) setBio(bio);
      if (profileImage) setProfileImage(profileImage);
      if (coverImage) setCoverImage(coverImage);
      if (youtube) setYoutube(youtube);
      if (tiktok) setTiktok(tiktok);
      if (instagram) setInstagram(instagram);
      if (customLink) setCustomLink(customLink);
    }

    initUserInfo();
  }, [client?.currentUser]);

  const handleSave = async () => {
    if (isLoading) return;
    if (!name) return toast.error("Name is required!");

    setIsLoading(true);
    const info = (client?.currentUser as unknown as ActivityActor)?.data;

    toast.loading("Saving your profile info...");
    let uploadedProfileImageUrl = "";
    let uploadedBannerImageUrl = "";

    if (profileImage instanceof File) {
      uploadedProfileImageUrl = await storage.saveFile(profileImage);
      const prevProfile = client?.currentUser?.data?.profileImage;
      if (prevProfile && !prevProfile.includes("googleusercontent"))
        await storage.deleteFile(prevProfile);
    }
    if (coverImage instanceof File) {
      uploadedBannerImageUrl = await storage.saveFile(coverImage);
      const prevCover = client?.currentUser?.data?.coverImage;
      if (prevCover) await storage.deleteFile(prevCover as string);
    }

    const newProfileImage =
      uploadedProfileImageUrl || client?.currentUser?.data?.profileImage;

    const computedCoverImage =
      uploadedBannerImageUrl || client?.currentUser?.data?.coverImage;

    await client?.currentUser?.update({
      ...info,
      name,
      bio,
      youtube,
      tiktok,
      instagram,
      customLink,
      profileImage: newProfileImage,
      coverImage: computedCoverImage,
    });
    await service.updateUserInfo({
      name,
      bio,
      youtube,
      tiktok,
      instagram,
      customLink,
      profileImage: newProfileImage,
      coverImage: computedCoverImage,
    });
    setIsLoading(false);
    toast.dismiss();

    navigate(-1);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "profile") setProfileImage(file);
      else if (type === "banner") setCoverImage(file);
    }
  };

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate(-1)}>&larr;</BackButton>
        <Title>Edit Profile</Title>
        <SaveButton onClick={handleSave}>
          {isLoading ? "Saving..." : "Save"}
        </SaveButton>
      </Header>

      <Banner>
        <img
          src={
            coverImage instanceof File
              ? URL.createObjectURL(coverImage)
              : coverImage
          }
          alt="Banner"
        />
        <input type="file" onChange={(e) => handleImageChange(e, "banner")} />
      </Banner>

      <ProfilePicture>
        <img
          src={
            profileImage instanceof File
              ? URL.createObjectURL(profileImage)
              : profileImage
          }
          alt="Profile"
        />
        <input type="file" onChange={(e) => handleImageChange(e, "profile")} />
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
        <FormControl>
          <Label>YouTube</Label>
          <Input
            type="url"
            placeholder="https://youtube.com/yourchannel"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Label>TikTok</Label>
          <Input
            type="url"
            placeholder="https://tiktok.com/@yourhandle"
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Label>Instagram</Label>
          <Input
            type="url"
            placeholder="https://instagram.com/yourhandle"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <Label>Custom Link</Label>
          <Input
            type="url"
            placeholder="https://yourwebsite.com"
            value={customLink}
            onChange={(e) => setCustomLink(e.target.value)}
          />
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
    background-color: var(--primary-color);
  }
`;

const Banner = styled.div`
  width: 100%;
  height: 150px;
  background-color: #e1e8ed;
  margin-top: 0;
  overflow: hidden;
  position: relative;

  img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  input {
    position: absolute;
    bottom: 10px;
    right: 10px;
    opacity: 0.8;
    background-color: #000;
    color: #fff;
    padding: 6px;
    border-radius: 8px;
    cursor: pointer;
  }
`;

const ProfilePicture = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #e1e8ed;
  border: 1px solid #fff;
  overflow: hidden;
  position: relative;
  top: -36px;
  left: 16px;

  img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  input {
    position: absolute;
    bottom: 10px;
    right: 10px;
    opacity: 0.8;
    background-color: #000;
    color: #fff;
    padding: 4px;
    border-radius: 8px;
    cursor: pointer;
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
