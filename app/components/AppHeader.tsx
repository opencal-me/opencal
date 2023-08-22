import type { FC } from "react";
import { Header, Image } from "@mantine/core";

import AppMenu from "./AppMenu";

import type { AppViewerFragment } from "~/helpers/graphql";
import type { Maybe } from "~/helpers/graphql";

import iconSrc from "~/assets/images/icon.png";

export type AppHeaderProps = {
  readonly viewer: Maybe<AppViewerFragment>;
};

const AppHeader: FC<AppHeaderProps> = ({ viewer }) => (
  <Header
    height={38}
    p={8}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      columnGap: 6,
    }}
  >
    <Button
      component={Link}
      href="/"
      leftIcon={<Image src={iconSrc} width={24} />}
      color="dark"
      compact
      variant="subtle"
      radius="xl"
      py={4}
      pl={1}
      pr={8}
      fz="md"
      fw={700}
      styles={({ colors }) => ({
        root: {
          flexShrink: 0,
          "&:hover": {
            backgroundColor: colors.gray[1],
          },
        },
        leftIcon: {
          marginRight: rem(4),
        },
      })}
    >
      OpenCal
    </Button>
    <AppMenu sx={{ flexShrink: 0 }} {...{ viewer }} />
  </Header>
);

export default AppHeader;
