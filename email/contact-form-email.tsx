import React from "react";
import {
  Html,
  Body,
  Head,
  Hr,
  Container,
  Preview,
  Section,
  Text,
  Link,
} from "@react-email/components";

type ContactFormEmailProps = {
  message: string;
  senderEmail: string;
};

export default function ContactFormEmail({
  message,
  senderEmail,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New message from {senderEmail}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Top accent bar */}
          <Section style={accentBar} />

          <Section style={card}>
            {/* Header */}
            <Section style={header}>
              <Text style={logoText}>David Beauchamp</Text>
              <Text style={headerSubtitle}>Portfolio Contact Form</Text>
            </Section>

            <Hr style={divider} />

            {/* Badge */}
            <Section style={badgeRow}>
              <Text style={badge}>New Message</Text>
            </Section>

            {/* Message content */}
            <Section style={messageSection}>
              <Text style={label}>Message</Text>
              <Section style={messageBox}>
                <Text style={messageText}>{message}</Text>
              </Section>
            </Section>

            {/* Sender info */}
            <Section style={senderSection}>
              <Text style={label}>From</Text>
              <Section style={senderBox}>
                <Text style={senderIcon}>✉</Text>
                <Link href={`mailto:${senderEmail}`} style={senderLink}>
                  {senderEmail}
                </Link>
              </Section>
            </Section>

            <Hr style={divider} />

            {/* Footer */}
            <Text style={footer}>
              Sent via the contact form on your portfolio website.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#0a0f1e",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: "40px 0",
  margin: 0,
};

const container: React.CSSProperties = {
  maxWidth: "560px",
  margin: "0 auto",
};

const accentBar: React.CSSProperties = {
  height: "4px",
  background: "linear-gradient(90deg, #7bdbd4, #6c90ff, #45c5bc)",
  borderRadius: "8px 8px 0 0",
};

const card: React.CSSProperties = {
  backgroundColor: "#111827",
  border: "1px solid rgba(128, 169, 255, 0.15)",
  borderTop: "none",
  borderRadius: "0 0 12px 12px",
  padding: "0 32px 32px",
};

const header: React.CSSProperties = {
  paddingTop: "28px",
  paddingBottom: "4px",
  textAlign: "center" as const,
};

const logoText: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 600,
  letterSpacing: "0.04em",
  color: "#7bdbd4",
  margin: "0 0 2px",
};

const headerSubtitle: React.CSSProperties = {
  fontSize: "12px",
  fontWeight: 400,
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  color: "#9db7ff",
  margin: 0,
};

const divider: React.CSSProperties = {
  borderColor: "rgba(128, 169, 255, 0.15)",
  borderWidth: "1px 0 0 0",
  margin: "20px 0",
};

const badgeRow: React.CSSProperties = {
  textAlign: "center" as const,
  marginBottom: "8px",
};

const badge: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "rgba(113, 145, 255, 0.15)",
  border: "1px solid rgba(113, 145, 255, 0.25)",
  color: "#9db7ff",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  padding: "5px 14px",
  borderRadius: "999px",
  margin: 0,
};

const label: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.16em",
  textTransform: "uppercase" as const,
  color: "rgba(214, 229, 255, 0.5)",
  margin: "0 0 8px",
};

const messageSection: React.CSSProperties = {
  marginBottom: "24px",
};

const messageBox: React.CSSProperties = {
  backgroundColor: "rgba(12, 18, 35, 0.85)",
  border: "1px solid rgba(128, 169, 255, 0.12)",
  borderRadius: "10px",
  padding: "16px 20px",
};

const messageText: React.CSSProperties = {
  color: "#ecf2ff",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: 0,
  whiteSpace: "pre-wrap" as const,
};

const senderSection: React.CSSProperties = {
  marginBottom: "8px",
};

const senderBox: React.CSSProperties = {
  backgroundColor: "rgba(12, 18, 35, 0.85)",
  border: "1px solid rgba(128, 169, 255, 0.12)",
  borderRadius: "10px",
  padding: "12px 20px",
};

const senderIcon: React.CSSProperties = {
  display: "inline",
  fontSize: "14px",
  marginRight: "8px",
  color: "#7bdbd4",
};

const senderLink: React.CSSProperties = {
  color: "#7bdbd4",
  fontSize: "14px",
  fontWeight: 500,
  textDecoration: "none",
};

const footer: React.CSSProperties = {
  fontSize: "12px",
  color: "rgba(214, 229, 255, 0.35)",
  textAlign: "center" as const,
  margin: "4px 0 0",
  lineHeight: "1.5",
};
