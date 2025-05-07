import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
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
}: SignupConfirmationEmailProps) => {
    // Ensure the email is URI encoded to handle special characters
    const encodedEmail = encodeURIComponent(email);
    
    // Build the full verification URL
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/verify/${encodedEmail}`;
    
    return (
        <Html>
            <Head />
            <Preview>
                Welcome to B'Dazzle Cafe! Please verify your account to start your coffee journey.
            </Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header with background */}
                    <Section style={headerContainer}>
                        <Img
                            src="https://wq8gj23taekk62rr.public.blob.vercel-storage.com/deku/logo-11qVd4r8k5tOjqMdgoZjW3KYsr3H2v.png"
                            width="120"
                            height="120"
                            alt="B'Dazzle Cafe Logo"
                            style={logo}
                        />
                        <Heading style={headerText}>Welcome to B'Dazzle Cafe!</Heading>
                    </Section>
                    
                    {/* Main content */}
                    <Section style={contentContainer}>
                        <Text style={greeting}>Hello {name},</Text>
                        
                        <Text style={paragraph}>
                            Thank you for joining our community of coffee enthusiasts! We're excited to have you with us.
                        </Text>
                        
                        <Text style={paragraph}>
                            Before you can place your first order and experience our delicious coffees, please verify your email address by clicking the button below.
                        </Text>
                        
                        {/* Verification button */}
                        <Section style={buttonContainer}>
                            <Link href={verificationUrl} style={button}>
                                Verify My Email
                            </Link>
                        </Section>
                        
                        {/* Security note */}
                        <Section style={noteContainer}>
                            <Text style={noteText}>
                                For your security, this verification link will expire in 24 hours. If you did not create an account with B'Dazzle Cafe, please disregard this email.
                            </Text>
                        </Section>
                        
                        {/* Fallback text link */}
                        <Text style={paragraph}>
                            If the button doesn't work, copy and paste this link into your browser:
                        </Text>
                        <Text style={linkContainer}>
                            <Link href={verificationUrl} style={textLink}>
                                {verificationUrl}
                            </Link>
                        </Text>
                        
                        {/* Coffee quote */}
                        <Section style={quoteContainer}>
                            <Text style={quoteText}>
                                "Life begins after coffee."
                            </Text>
                        </Section>
                        
                        <Text style={paragraph}>
                            We look forward to serving you soon!
                        </Text>
                        
                        <Text style={signature}>
                            The B'Dazzle Cafe Team
                        </Text>
                    </Section>
                    
                    {/* Footer */}
                    <Section style={footerContainer}>
                        <Text style={footerText}>
                            © 2025 B'Dazzle Cafe. All rights reserved.
                        </Text>
                        <Text style={footerText}>
                            Manila, Philippines
                        </Text>
                        <Text style={footerLinks}>
                            <Link href="#" style={footerLink}>Privacy Policy</Link> • 
                            <Link href="#" style={footerLink}> Terms of Service</Link> •
                            <Link href="#" style={footerLink}> Contact Us</Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default SignupConfirmationEmail;

// Main styles
const main = {
    backgroundColor: '#f5f5f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    color: '#333333',
};

const container = {
    margin: '0 auto',
    padding: '0',
    width: '600px',
    maxWidth: '100%',
};

// Header styles
const headerContainer = {
    backgroundColor: '#6F4E37',
    padding: '40px 20px',
    textAlign: 'center' as const,
};

const logo = {
    margin: '0 auto 20px',
    backgroundColor: 'white',
    borderRadius: '60px',
    padding: '10px',
};

const headerText = {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0',
    textAlign: 'center' as const,
};

// Content styles
const contentContainer = {
    backgroundColor: '#ffffff',
    padding: '40px 30px',
    borderRadius: '0 0 4px 4px',
};

const greeting = {
    fontSize: '20px',
    lineHeight: '28px',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: '20px',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#4a4a4a',
    marginBottom: '20px',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '35px 0',
};

const button = {
    backgroundColor: '#6F4E37',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '14px 35px',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
    border: 'none',
    cursor: 'pointer',
};

const noteContainer = {
    backgroundColor: '#f8f8f8',
    borderRadius: '6px',
    padding: '15px',
    marginBottom: '30px',
};

const noteText = {
    fontSize: '14px',
    lineHeight: '22px',
    color: '#6b6b6b',
    margin: '0',
};

const linkContainer = {
    margin: '16px 0 30px',
    padding: '15px',
    backgroundColor: '#f8f8f8',
    borderRadius: '6px',
    fontSize: '14px',
    wordBreak: 'break-all' as const,
};

const textLink = {
    color: '#6F4E37',
    textDecoration: 'underline',
    fontWeight: 'bold',
};

const quoteContainer = {
    textAlign: 'center' as const,
    margin: '35px 0',
    fontStyle: 'italic',
};

const quoteText = {
    fontSize: '18px',
    lineHeight: '28px',
    color: '#6F4E37',
    margin: '0',
};

const signature = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#555555',
    marginTop: '30px',
};

// Footer styles
const footerContainer = {
    backgroundColor: '#f0f0f0',
    padding: '30px',
    borderRadius: '4px',
    textAlign: 'center' as const,
    marginTop: '20px',
};

const footerText = {
    fontSize: '13px',
    lineHeight: '20px',
    color: '#8898aa',
    margin: '5px 0',
};

const footerLinks = {
    fontSize: '13px',
    lineHeight: '20px',
    color: '#8898aa',
    margin: '15px 0 0',
};

const footerLink = {
    color: '#6F4E37',
    textDecoration: 'none',
};