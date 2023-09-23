import type { FC, ReactNode } from "react";
import { Card } from "@mantine/core";
import type { BoxProps } from "@mantine/core";

import type { InertiaLinkProps } from "@inertiajs/react";

import type { GroupCardGroupFragment } from "~/helpers/graphql";

export type GroupCardProps = Omit<BoxProps, "children"> &
  Pick<InertiaLinkProps, "href"> & {
    readonly group: GroupCardGroupFragment;
    readonly topSection?: ReactNode;
  };

const GroupCard: FC<GroupCardProps> = ({
  group: { name },
  href,
  ...otherProps
}) => (
  <AnchorContainer
    component={Link}
    pos="relative"
    {...{ href }}
    {...otherProps}
  >
    <Card withBorder sx={{ cursor: "pointer" }}>
      {name}
    </Card>
  </AnchorContainer>
);

export default GroupCard;
