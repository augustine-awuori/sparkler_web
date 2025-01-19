import styled from "styled-components";

const CSAEPolicyPage = () => {
  return (
    <Container>
      <Title>Policy Against Child Sexual Abuse and Exploitation (CSAE)</Title>
      <Paragraph>
        At <strong>Your App Name</strong>, we are committed to maintaining a
        safe and secure platform for all users, especially children. We have a
        zero-tolerance policy for any form of child sexual abuse and
        exploitation.
      </Paragraph>

      <SectionTitle>Our Commitment</SectionTitle>
      <List>
        <ListItem>
          We strictly prohibit any content that promotes, depicts, or involves
          child sexual abuse or exploitation.
        </ListItem>
        <ListItem>
          We actively monitor and report any suspicious activities or content to
          the appropriate legal authorities.
        </ListItem>
        <ListItem>
          We collaborate with law enforcement and child protection agencies to
          support the fight against CSAE.
        </ListItem>
      </List>

      <SectionTitle>Reporting CSAE Content</SectionTitle>
      <Paragraph>
        If you encounter any content or behavior on our platform that you
        believe violates our policy, please report it immediately:
      </Paragraph>
      <List>
        <ListItem>
          Email:{" "}
          <Link href="mailto:augustineawuori95@gmail.com">
            augustineawuori95@gmail.com
          </Link>
        </ListItem>
        <ListItem>
          Report Abuse Feature: Use the in-app "Report Abuse" option.
        </ListItem>
      </List>
      <Paragraph>
        We take all reports seriously and will act promptly to investigate and
        address any concerns.
      </Paragraph>

      <SectionTitle>Preventative Measures</SectionTitle>
      <Paragraph>
        To ensure the safety of our platform, we implement the following
        measures:
      </Paragraph>
      <List>
        <ListItem>
          Regular content moderation using advanced detection technologies and
          manual review.
        </ListItem>
        <ListItem>
          Mandatory user verification processes to prevent fake or malicious
          accounts.
        </ListItem>
        <ListItem>
          Educational resources for users on how to stay safe online and
          recognize harmful content.
        </ListItem>
      </List>

      <SectionTitle>Legal Compliance</SectionTitle>
      <Paragraph>
        We comply with all applicable laws and regulations regarding child
        protection and cooperate fully with legal authorities in investigating
        and addressing any instances of CSAE.
      </Paragraph>

      <SectionTitle>Contact Us</SectionTitle>
      <Paragraph>
        If you have questions or concerns about this policy, please contact us
        at:
        <br />
        Email:{" "}
        <Link href="mailto:augustineawuori95@gmail.com">
          augustineawuori95@gmail.com
        </Link>
      </Paragraph>

      <Footer>
        © {new Date().getFullYear()} Sparkler. All rights reserved.
      </Footer>
    </Container>
  );
};

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

export default CSAEPolicyPage;
