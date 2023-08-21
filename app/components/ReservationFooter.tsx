import type { FC } from "react";
import ShareIcon from "~icons/lucide/share";

import { ActionIcon, Text } from "@mantine/core";
import type { BoxProps } from "@mantine/core";

import type { ReservationFooterActivityFragment } from "~/helpers/graphql";
import { ReservationCreateForm } from "./ReservationCreateForm";

export type ReservationFooterProps = Omit<BoxProps, "children"> & {
  readonly activity: ReservationFooterActivityFragment;
};

const ReservationFooter: FC<ReservationFooterProps> = ({
  activity: { id: activityId, handle, openings, storyImageUrl },
  sx,
  ...otherProps
}) => {
  const [storyImageLoading, setStoryImageLoading] = useState(false);
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
            {navigator.share !== undefined && (
              <ActionIcon
                variant="subtle"
                color="gray"
                radius="md"
                sx={({ black }) => ({ color: black })}
                loading={storyImageLoading}
                onClick={() => {
                  setStoryImageLoading(true);
                  fetch(storyImageUrl)
                    .then(response => response.blob())
                    .then(blob => {
                      const file = new File([blob], `${handle}.png`);
                      navigator.share({
                        title: "Share this activity on your story!",
                        files: [file],
                      });
                    })
                    .finally(() => {
                      setStoryImageLoading(false);
                    });
                }}
              >
                <Text component={ShareIcon} />
              </ActionIcon>
            )}
            <Button
              color="dark"
              px="xl"
              onClick={() => {
                openModal({
                  title: "Reserve your spot!",
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
