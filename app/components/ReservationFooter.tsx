import type { FC } from "react";
import ShareIcon from "~icons/lucide/share";

import { ActionIcon, Text } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import type { BoxProps } from "@mantine/core";

import type { ReservationFooterActivityFragment } from "~/helpers/graphql";
import { ReservationCreateForm } from "./ReservationCreateForm";

export type ReservationFooterProps = Omit<BoxProps, "children"> & {
  readonly activity: ReservationFooterActivityFragment;
};

const ReservationFooter: FC<ReservationFooterProps> = ({
  activity: { id: activityId, openings, owner, url, storyImageUrl },
  sx,
  ...otherProps
}) => {
  // == Copy Story Image
  const { copy, copied } = useClipboard();
  useEffect(() => {
    if (copied) {
      const localDateTime = DateTime.local();
      const url = new URL(storyImageUrl);
      url.searchParams.set("timezone", localDateTime.zoneName);
      open(url.toString(), "_blank");
    }
  }, [copied]);

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
          <Group spacing={8}>
            <Tooltip
              label="Copy the activity URL, and open promo image"
              withArrow
            >
              <ActionIcon
                variant="subtle"
                color="gray"
                radius="md"
                sx={({ black }) => ({ color: black })}
                onClick={() => {
                  copy(url);
                }}
              >
                <Text component={ShareIcon} />
              </ActionIcon>
            </Tooltip>
            <Button
              color="dark"
              px="xl"
              onClick={() => {
                openModal({
                  title: (
                    <Box>
                      <Text span>Reserve your spot</Text>
                      <Text size="sm" weight={400} color="dimmed" lh={1.3}>
                        Let {owner.firstName} know you&apos;re coming!
                      </Text>
                    </Box>
                  ),
                  children: (
                    <ReservationCreateForm
                      onReserve={() => {
                        closeAllModals();
                      }}
                      {...{ activityId }}
                    />
                  ),
                });
              }}
            >
              I&apos;ll be there!
            </Button>
          </Group>
        </Group>
      </Container>
    </Box>
  );
};

export default ReservationFooter;
