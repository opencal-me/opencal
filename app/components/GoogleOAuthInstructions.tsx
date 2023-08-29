import type { FC } from "react";
import { Text, Image } from "@mantine/core";
import type { BoxProps } from "@mantine/core";

import instructionsSrc from "~/assets/images/google-oauth-instructions.gif";

export type GoogleOAuthInstructionsProps = Omit<BoxProps, "children">;

const GoogleOAuthInstructions: FC<GoogleOAuthInstructionsProps> = props => (
  <Stack {...props}>
    <Stack spacing={4} lh={1.3} fz="sm">
      <Text inherit>
        OpenCal is currently pending verification with Google.
      </Text>
      <Text inherit color="red.9" fw={500}>
        If you see a warning screen, please proceed as follows to continue:
      </Text>
    </Stack>
    <Image
      src={instructionsSrc}
      width={400}
      my="xs"
      sx={{ alignSelf: "center" }}
    />
  </Stack>
);

export default GoogleOAuthInstructions;
