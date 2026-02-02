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
} from "@react-email/components";
import * as React from "react";

interface AgentCreationCompleteEmailProps {
  userName?: string;
  agentName: string;
  agentId: string;
  dashboardUrl: string;
}

export const AgentCreationCompleteEmail = ({
  userName = "there",
  agentName,
  agentId,
  dashboardUrl,
}: AgentCreationCompleteEmailProps) => (
  <Html>
    <Head />
    <Preview>Your AI agent {agentName} is ready to use!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your Agent is Ready!</Heading>
        <Text style={text}>Hi {userName},</Text>
        <Text style={text}>
          Great news! Your AI agent <strong>{agentName}</strong> has been
          successfully created and is now ready to use.
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={`${dashboardUrl}/agents`}>
            View Your Agent
          </Button>
        </Section>

        <Hr style={hr} />

        <Section style={infoSection}>
          <Heading as="h2" style={h2}>
            What&apos;s Next?
          </Heading>
          <Text style={bulletText}>
            • <strong>Test your agent:</strong> Start a conversation to see how
            it responds
          </Text>
          <Text style={bulletText}>
            • <strong>Integrate channels:</strong> Connect your agent to
            messaging platforms
          </Text>
          <Text style={bulletText}>
            • <strong>Monitor performance:</strong> Track conversations and
            improve responses
          </Text>
        </Section>

        <Hr style={hr} />

        <Section style={footerSection}>
          <Text style={footerText}>
            Need help? Visit our{" "}
            <Link href={`${dashboardUrl}/help`} style={link}>
              Help Center
            </Link>{" "}
            or reply to this email.
          </Text>
          <Text style={footerText}>
            Happy building!
            <br />
            The Linkaiil Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

AgentCreationCompleteEmail.PreviewProps = {
  userName: "John",
  agentName: "Customer Support Bot",
  agentId: "abc123",
  dashboardUrl: "https://app.linkaiil.com",
} as AgentCreationCompleteEmailProps;

export default AgentCreationCompleteEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const h1 = {
  color: "#333",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 40px",
  textAlign: "center" as const,
};

const h2 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "600",
  margin: "24px 0 16px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
  padding: "0 40px",
};

const bulletText = {
  color: "#333",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "8px 0",
};

const buttonContainer = {
  padding: "27px 0 27px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5469d4",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 40px",
};

const link = {
  color: "#5469d4",
  textDecoration: "underline",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const infoSection = {
  padding: "0 40px",
};

const footerSection = {
  padding: "0 40px",
  marginTop: "32px",
};

const footerText = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 0",
};
