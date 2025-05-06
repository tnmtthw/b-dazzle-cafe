import {
    Body,
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

interface SignupConfirmationEmailProps {
    name: string;
    email: string;
}

export const SignupConfirmationEmail = ({
    name,
    email,
}: SignupConfirmationEmailProps) => (
    <Html>
        <Head />
        <Preview>
            Welcome to B-Dazzle Cafe! Please verify your account before placing your first order.
        </Preview>
        <Body style={main}>
            <Container style={container}>
                <Img
                    src="https://wq8gj23taekk62rr.public.blob.vercel-storage.com/deku/logo-11qVd4r8k5tOjqMdgoZjW3KYsr3H2v.png"
                    width="170"
                    height="170"
                    alt="FMT"
                    style={logo}
                />
                <Heading style={h1}>Welcome to B-Dazzle Cafe!</Heading>
                <Text style={text}>
                    Hello {name},
                </Text>
                <Text style={text}>
                    Thank you for signing up for B-Dazzle Cafe! Before you can place your first coffee order, we need to verify your email address.
                </Text>
                <Section style={buttonContainer}>
                    <Link style={button} href={`http://localhost:3000/account/verify/${email}`}>
                        Verify your email address
                    </Link>
                </Section>
                <Text style={text}>
                    Please click the button above to verify your account. Once verified, you'll be able to log in and start enjoying our delicious coffees.
                </Text>
                <Text style={text}>
                    If you have any questions or need assistance, feel free to reach out to our team.
                </Text>
                <Text style={text}>We look forward to serving you soon!</Text>
                <Hr style={hr} />
                <Text style={footer}>
                    © 2025 B-Dazzle Cafe. All rights reserved.
                    <br />
                    Manila, Philippines
                </Text>
            </Container>
        </Body>
    </Html>
);

export default SignupConfirmationEmail;

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
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '30px 0',
};

const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
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