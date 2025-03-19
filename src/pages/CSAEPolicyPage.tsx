import styled from "styled-components";

const PrivacyPolicyPage = () => {
  return (
    <Container>
      <Title>Privacy Policy</Title>
      <Paragraph>
        At Sparkler, we value your privacy and are committed to protecting your
        personal information. This Privacy Policy explains how we collect, use,
        and safeguard your data.
      </Paragraph>

      <SectionTitle>Information We Collect</SectionTitle>
      <List>
        <ListItem>
          Personal data like your name, email, and account details when you sign
          up.
        </ListItem>
        <ListItem>
          Usage data, such as browsing activity and interactions on our
          platform.
        </ListItem>
      </List>

      <SectionTitle>How We Use Your Data</SectionTitle>
      <Paragraph>
        We use your information to provide and improve our services, including:
      </Paragraph>
      <List>
        <ListItem>Personalizing your experience.</ListItem>
        <ListItem>Ensuring platform security and compliance.</ListItem>
      </List>

      <SectionTitle>Contact Us</SectionTitle>
      <Paragraph>
        For privacy-related inquiries, reach us at:{" "}
        <Link href="mailto:privacy@sparkler.com">privacy@sparkler.com</Link>
      </Paragraph>

      <Footer>
        © {new Date().getFullYear()} Sparkler. All rights reserved.
      </Footer>
    </Container>
  );
};

// Same styled-components as your original code
const Container = styled.div`
  font-family: "Arial, sans-serif";
  padding: 20px;
  max-width: 900px;
  margin: auto;
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: #007bff;
  font-size: 1.5rem;
  margin-top: 20px;
`;

const Paragraph = styled.p`
  color: #555;
  line-height: 1.6;
  margin: 10px 0;
`;

const List = styled.ul`
  margin: 10px 0;
  padding-left: 20px;
  color: #555;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
`;

const Link = styled.a`
  color: #007bff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Footer = styled.footer`
  text-align: center;
  margin-top: 40px;
  font-size: 0.9rem;
  color: #777;
`;

export default PrivacyPolicyPage;
