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
    
    // Build the full verification URL with dynamic base URL
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account/verify/${encodedEmail}`;
    
    return (
        <Html>
            <Head />
            <Preview>
                Verify your B'Dazzle Cafe account to get started
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
                    
                    {/* Main content - keeping text-to-image ratio high (80:20) */}
                    <Section style={contentContainer}>
                        <Text style={greeting}>Hello {name},</Text>
                        
                        <Text style={paragraph}>
                            Thank you for creating your account with B'Dazzle Cafe. We're excited to have you join our community!
                        </Text>
                        
                        <Text style={paragraph}>
                            Please verify your email address to activate your account and enjoy our delicious coffee offerings.
                        </Text>
                        
                        {/* Clean, simple verification button */}
                        <Section style={buttonContainer}>
                            <Link href={verificationUrl} style={button}>
                                Verify My Email
                            </Link>
                        </Section>
                        
                        {/* Fallback text link - essential for deliverability */}
                        <Text style={paragraph}>
                            If the button doesn't work, please copy and paste this link into your browser:
                        </Text>
                        <Text style={linkContainer}>
                            <Link href={verificationUrl} style={textLink}>
                                {verificationUrl}
                            </Link>
                        </Text>
                        
                        <Text style={paragraph}>
                            This verification link will expire in 24 hours. If you didn't create an account with us, you can safely ignore this email.
                        </Text>
                        
                        <Text style={paragraph}>
                            We look forward to serving you soon!
                        </Text>
                        
                        <Text style={signature}>
                            The B'Dazzle Cafe Team
                        </Text>
                    </Section>
                    
                    {/* Footer with required physical address and unsubscribe link */}
                    <Section style={footerContainer}>
                        <Text style={footerText}>
                            © 2025 B'Dazzle Cafe. All rights reserved.
                        </Text>
                        <Text style={footerText}>
                            123 Coffee Street, Manila, Philippines
                        </Text>
                        <Text style={footerLinks}>
                            <Link href="#" style={footerLink}>Privacy Policy</Link> • 
                            <Link href="#" style={footerLink}> Terms of Service</Link> •
                            <Link href="#" style={footerLink}> Unsubscribe</Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default SignupConfirmationEmail;

// Main styles - keeping simple with web-safe fonts
const main = {
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
    color: '#333333',
};

const container = {
    margin: '0 auto',
    padding: '0',
    width: '600px',
    maxWidth: '100%',
};

// Header styles - modest color usage
const headerContainer = {
    backgroundColor: '#6F4E37',
    padding: '30px 20px',
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
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
    textAlign: 'center' as const,
};

// Content styles - clean, readable text
const contentContainer = {
    backgroundColor: '#ffffff',
    padding: '30px 25px',
    borderRadius: '0 0 4px 4px',
};

const greeting = {
    fontSize: '20px',
    lineHeight: '26px',
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: '20px',
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#4a4a4a',
    marginBottom: '20px',
};

const buttonContainer = {
    textAlign: 'center' as const,
    margin: '30px 0',
};

// Clean, minimalist button design
const button = {
    backgroundColor: '#6F4E37',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 30px',
    border: 'none',
};

const linkContainer = {
    margin: '16px 0 25px',
    padding: '12px',
    backgroundColor: '#f8f8f8',
    borderRadius: '4px',
    fontSize: '14px',
    wordBreak: 'break-all' as const,
};

const textLink = {
    color: '#6F4E37',
    textDecoration: 'underline',
};

const signature = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#555555',
    marginTop: '25px',
};

// Footer styles - compliant with anti-spam laws
const footerContainer = {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '4px',
    textAlign: 'center' as const,
    marginTop: '20px',
};

const footerText = {
    fontSize: '12px',
    lineHeight: '18px',
    color: '#8898aa',
    margin: '4px 0',
};

const footerLinks = {
    fontSize: '12px',
    lineHeight: '18px',
    color: '#8898aa',
    margin: '12px 0 0',
};

const footerLink = {
    color: '#6F4E37',
    textDecoration: 'none',
};