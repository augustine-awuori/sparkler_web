import styled from "styled-components";

const AboutPage = () => {
  return (
    <AboutContainer>
      <ContentWrapper>
        <Title>About Sparkler</Title>

        <Paragraph>
          Welcome to <Highlight>Sparkler</Highlight>, your go-to app for
          seamless communication and sharing of important updates. Sparkler is
          designed to reduce the clutter and hassle of multiple messages in
          different groups by providing a unified platform.
        </Paragraph>

        <SectionTitle>Our Mission</SectionTitle>
        <Paragraph>
          At Sparkler, our mission is to make communication seamless and reduce
          the repetitive forwarding of messages by lecturers and authorities.
          With Sparkler, you have one place to find all the information you
          need, making staying informed effortless.
        </Paragraph>

        <SectionTitle>Why Sparkler?</SectionTitle>
        <Paragraph>
          Instead of searching through endless chats, Sparkler gives you a
          single source of truth. Want to know what a particular person has said
          over time? Simply visit their profile to view all their sparkles
          (posts) in one place.
        </Paragraph>

        <SectionTitle>Key Features</SectionTitle>
        <Paragraph>
          - Effortless sharing of photos, updates, and posts.
          <br />
          - Discover trending content and follow your favorite creators or
          authorities.
          <br />- Seamless and secure communication with an intuitive interface.
        </Paragraph>

        {/* Add Download Button Here */}
        <SectionTitle>Get the App</SectionTitle>
        <Paragraph>
          Download Sparkler on your Android device today and experience seamless
          communication on the go!
        </Paragraph>
        <DownloadButton
          href="https://play.google.com/store/apps/details?id=sparkler.lol"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download on Google Play
        </DownloadButton>

        <SectionTitle>Contact Us</SectionTitle>
        <Paragraph>
          We love hearing from our users! For feedback, support, or inquiries,
          please email us at <Highlight>augustineawuori95@gmail.com</Highlight>.
        </Paragraph>

        <Footer>
          © {new Date().getFullYear()} Sparkler. All rights reserved.
        </Footer>
      </ContentWrapper>
    </AboutContainer>
  );
};

const AboutContainer = styled.div`
  background-color: #000;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  width: 100%;
  text-align: left;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  color: #1e90ff;
  margin-top: 30px;
  margin-bottom: 15px;
`;

const Paragraph = styled.p`
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 15px;
  color: #ddd;
`;

const Highlight = styled.span`
  color: #1e90ff;
  font-weight: bold;
`;

const Footer = styled.footer`
  font-size: 14px;
  color: #888;
  text-align: center;
  margin-top: 50px;
`;

const DownloadButton = styled.a`
  display: inline-block;
  background-color: #1e90ff;
  color: #fff;
  padding: 12px 24px;
  border-radius: 26px;
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-top: 15px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: (var(--primary-color));
    color: #fff;
  }
`;

export default AboutPage;
