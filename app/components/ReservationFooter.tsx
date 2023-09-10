import type { FC } from "react";
// import ShareIcon from "~icons/lucide/share";

import { /* ActionIcon, */ Text } from "@mantine/core";
// import { useClipboard } from "@mantine/hooks";
import type { BoxProps } from "@mantine/core";

import type { ReservationFooterActivityFragment } from "~/helpers/graphql";

import { ReservationCreateForm } from "./ReservationCreateForm";

export type ReservationFooterProps = Omit<BoxProps, "children"> & {
  readonly activity: ReservationFooterActivityFragment;
};

const ReservationFooter: FC<ReservationFooterProps> = ({
  activity,
  sx,
  ...otherProps
}) => {
  const { openings, owner /* url, storyImageUrl */ } = activity;
  const hasOpenings = openings > 0;

  // == Routing
  const router = useRouter();

  // == Copy Story Image
  /*
  const { copy, copied } = useClipboard();
  useEffect(() => {
    if (copied) {
      open(storyImageUrl, "_blank");
    }
  }, [copied]);
  */

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
        <Group spacing="sm" position="apart" noWrap>
          {/* <Text size="sm" color="gray.7">
            {openings} {openings === 1 ? "spot" : "spots"} remaining
          </Text> */}
          <Box>
            <Text
              size="sm"
              color="gray.7"
              sx={({ fn }) => ({
                [fn.smallerThan(428)]: { display: "none" },
              })}
            >
              Get involved with {owner.firstName}&apos;s life :)
            </Text>
          </Box>
          <Group spacing={8}>
            {/* <Tooltip
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
            </Tooltip> */}
            <Tooltip
              label="Sorry, this event is full!"
              withArrow
              disabled={hasOpenings}
            >
              <Button
                variant="gradient"
                gradient={{ from: "brand", to: "indigo" }}
                px="md"
                fz="md"
                fw={800}
                sx={{
                  "&:not(:disabled)": {
                    boxShadow: "2px 2px 10px #00388b80",
                  },
                }}
                disabled={!hasOpenings}
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
                          router.reload({ preserveScroll: true });
                        }}
                        {...{ activity }}
                      />
                    ),
                  });
                }}
              >
                Join & add to calendar
              </Button>
            </Tooltip>
          </Group>
        </Group>
      </Container>
    </Box>
  );
};

export default ReservationFooter;
