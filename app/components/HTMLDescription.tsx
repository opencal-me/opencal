import type { FC } from "react";

import { TypographyStylesProvider } from "@mantine/core";
import type { TypographyStylesProviderProps } from "@mantine/core";

export type HTMLDescriptionProps = Omit<
  TypographyStylesProviderProps,
  "children"
> & {
  readonly children: string;
};

const HTMLDescription: FC<HTMLDescriptionProps> = ({
  children,
  sx,
  ...otherProps
}) => (
  <TypographyStylesProvider
    sx={[
      ...packSx(sx),
      ({ fontSizes, colors }) => ({
        color: colors.dark[3],
        fontSize: fontSizes.sm,
        p: {
          marginBottom: 0,
        },
      }),
    ]}
    {...otherProps}
  >
    <div dangerouslySetInnerHTML={{ __html: children }} />
  </TypographyStylesProvider>
);

export default HTMLDescription;
