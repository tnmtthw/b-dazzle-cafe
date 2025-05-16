import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ResetPasswordEmailProps {
  email: string;
  resetToken: string;
}

export const ResetPasswordEmail = ({
  email,
  resetToken,
}: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Reset your B'Dazzle Cafe account password
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://wq8gj23taekk62rr.public.blob.vercel-storage.com/deku/logo-11qVd4r8k5tOjqMdgoZjW3KYsr3H2v.png"
          width="170"
          height="170"
          alt="B'Dazzle Cafe"
          style={logo}
        />
        <Heading style={h1}>Password Reset Request</Heading>
        <Text style={text}>
          Hello {email},
        </Text>
        <Text style={text}>
          We received a request to reset your password for your B'Dazzle Cafe account. If you didn't make this request, you can safely ignore this email.
        </Text>
        <Text style={text}>
          To reset your password, click the button below. This link will expire in 30 minutes.
        </Text>
        <Section style={buttonContainer}>
          {/* <Link style={button} href={`https://b-dazzle-cafe.vercel.app/account/reset-password/${resetToken}`}> */}
          <Link style={button} href={`http://localhost:3000/account/reset-password/${resetToken}`}>
            Reset your password
          </Link>
        </Section>
        <Text style={text}>
          If you're having trouble clicking the button, copy and paste the URL below into your web browser:
        </Text>
        <Text style={text}>
          {/* <Link href={resetToken} style={link}>{`https://b-dazzle-cafe.vercel.app/account/reset-password/${resetToken}`}</Link> */}
          <Link href={resetToken} style={link}>{`http://localhost:3000/account/reset-password/${resetToken}`}</Link>
        </Text>
        <Text style={text}>
          Thank you for choosing B'Dazzle Cafe!
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          © 2025 B'Dazzle Cafe. All rights reserved.
          <br />
          Manila, Philippines
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ResetPasswordEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '560px',
};

const logo = {
  margin: '0 auto',
  marginBottom: '24px',
};

const h1 = {
  color: '#6F4E37',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#6F4E37',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  cursor: 'pointer',
};

const link = {
  color: '#6F4E37',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};