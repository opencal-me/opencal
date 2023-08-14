import type { FC } from "react";
import { Text, type BoxProps } from "@mantine/core";

import type { ReservationFooterActivityFragment } from "~/helpers/graphql";

export type ReservationFooterProps = Omit<BoxProps, "children"> & {
  readonly activity: ReservationFooterActivityFragment;
};

const ReservationFooter: FC<ReservationFooterProps> = ({
  activity: {
    id: activityId /* eslint-disable-line @typescript-eslint/no-unused-vars */,
    openings,
  },
  sx,
  ...otherProps
}) => {
  return (
    <Box
      bg="white"
      py="sm"
      sx={[
        ...packSx(sx),
        () => ({
          boxShadow:
            "0 -0.0325rem 0.1875rem rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0 -0.325rem 0.9375rem -0.3125rem, rgba(0, 0, 0, 0.04) 0 -0.2375rem 0.4375rem -0.3125rem",
        }),
      ]}
      {...otherProps}
    >
      <Container size="xs" w="100%">
        <Group position="apart">
          <Text size="sm" color="gray.7">
            {openings} {openings === 1 ? "spot" : "spots"} remaining
          </Text>
          <Button
            color="dark"
            px="xl"
            onClick={() => {
              showAlert({
                title: "TODO",
                message: "This needs to be implemented.",
              });
            }}
          >
            I&apos;ll be there!
          </Button>
        </Group>
      </Container>
    </Box>
  );
};

export default ReservationFooter;
