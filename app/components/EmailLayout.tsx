import type { FC, PropsWithChildren } from "react";
import type { CSSObject } from "@mantine/core";

import {
  Body,
  Container,
  Heading,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { PreviewProps } from "@react-email/components";

export type EmailLayoutProps = PropsWithChildren<{
  readonly header?: string;
  readonly preview?: PreviewProps["children"];
}>;

const EmailLayout: FC<EmailLayoutProps> = ({ header, preview, children }) => (
  <>
    {!!preview && (
      <Preview style={{ textTransform: "lowercase" }}>{preview}</Preview>
    )}
    <Box
      component={Body}
      sx={({ colors }) => ({
        '[data-id="react-email-text"]': {
          color: colors.gray[8],
        },
      })}
    >
      <Box component={Container} mx="auto" px={12} py={16}>
        {!!header && (
          <Box
            component={Heading}
            my={24}
            sx={({ headings: { sizes, ...style } }) => ({
              ...(sizes.h3 as CSSObject),
              ...(style as CSSObject),
            })}
          >
            {header}
          </Box>
        )}
        <Box component={Section}>{children}</Box>
        <Box component={Section} mt={40}>
          <Img src="/logo.png" width="32" height="32" />
          <Box
            component={Text}
            sx={({ fn }) => ({ color: fn.dimmed() })}
            style={{ margin: `${rem(4)} 0` }}
          >
            Sent by{" "}
            <Box
              component={Link}
              href="/"
              target="_blank"
              sx={({ fn }) => ({
                color: fn.primaryColor(),
                fontWeight: 500,
              })}
            >
              OpenCal
            </Box>
            . This email loves you.
          </Box>
        </Box>
      </Box>
    </Box>
  </>
);

export default EmailLayout;
