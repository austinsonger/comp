import { Body, Html, Text } from "@react-email/components";

export const WelcomeEmail = () => {
  return (
    <Html>
      <Body
        style={{
          backgroundColor: "#ffffff",
          margin: "0 auto",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        }}
      >
        <Text
          style={{
            fontSize: "14px",
            lineHeight: "24px",
            color: "#121212",
            whiteSpace: "pre-wrap",
          }}
        >
          {`Hey,

I'm Lewis, founder of Comp AI. Saw that you signed up for our waitlist, and I wanted to reach out to learn more about what you're focused on and see how we can help.

Free sometime to chat? https://cal.com/team/compai/meet-us

Best,
Lewis`}
        </Text>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;
