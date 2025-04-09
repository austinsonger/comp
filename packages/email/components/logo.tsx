import { Img, Section } from "@react-email/components";

export function Logo() {
  return (
    <Section className="mt-[32px]">
      <Img
        src={"https://trycomp.ai/logo.png"}
        width="45"
        height="45"
        alt="Comp AI"
        className="my-0 mx-auto block"
      />
    </Section>
  );
}
