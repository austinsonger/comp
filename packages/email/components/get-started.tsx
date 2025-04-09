import { Button, Section } from "@react-email/components";

export function GetStarted() {
  return (
    <Section className="text-center mt-[50px] mb-[50px]">
      <Button
        className="bg-transparent text-primary text-[14px] text-[#121212] font-medium no-underline text-center px-6 py-3 border border-solid border-[#121212]"
        href="https://trycomp.ai?utm_source=email&utm_medium=get-started-button"
      >
        Get started
      </Button>
    </Section>
  );
}
