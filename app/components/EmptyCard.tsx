import type { FC } from "react";
import { Text } from "@mantine/core";
import type { BoxProps } from "@mantine/core";

import EmptyIcon from "~icons/heroicons/inbox-20-solid";

export type EmptyCardProps = Omit<BoxProps, "children"> & {
  readonly itemLabel: string;
};

const EmptyCard: FC<EmptyCardProps> = ({ itemLabel, ...otherProps }) => (
  <Card withBorder py="lg" {...otherProps}>
    <Stack align="center" spacing={0}>
      <Box sx={({ colors }) => ({ color: colors.gray[6], lineHeight: 1.1 })}>
        <EmptyIcon />
      </Box>
      <Text size="sm" color="dimmed">
        No {itemLabel} to show
      </Text>
    </Stack>
  </Card>
);

export default EmptyCard;
