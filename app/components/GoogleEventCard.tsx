import type { FC, JSXElementConstructor } from "react";
import Linkify from "linkify-react";
import humanizeDuration from "humanize-duration";
import RightArrowIcon from "~icons/heroicons/arrow-right-20-solid";

import { Text, MantineProvider } from "@mantine/core";
import type { BoxProps, TextProps } from "@mantine/core";

import type {
  ActivityCreateButtonActivityFragment,
  GoogleEventCardEventFragment,
} from "~/helpers/graphql";

import ActivityCreateButton from "./ActivityCreateButton";

export type GoogleEventCardProps = Omit<BoxProps, "children"> & {
  readonly event: GoogleEventCardEventFragment;
  readonly onCreateActivity: (
    activity: ActivityCreateButtonActivityFragment,
  ) => void;
};

const durationHumanizer = humanizeDuration.humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
      ms: () => "ms",
    },
  },
  spacer: "",
  delimiter: " ",
});

const GoogleEventCard: FC<GoogleEventCardProps> = ({
  event: {
    id: eventId,
    title,
    description,
    start,
    durationSeconds,
    activity,
    viewerIsOrganizer,
  },
  onCreateActivity,
  ...otherProps
}) => {
  return (
    <Card withBorder {...otherProps}>
      <Group align="start">
        <Text weight={500} sx={{ flexGrow: 1 }}>
          {title}
        </Text>
        <MantineProvider
          inherit
          theme={{
            components: {
              Text: {
                defaultProps: {
                  size: "sm",
                  color: "dimmed",
                  lh: 1.4,
                },
              },
            },
          }}
        >
          <Group spacing={6} noWrap>
            <Box>
              <Time format={{ month: "short", day: "numeric" }}>{start}</Time>
            </Box>
            <Box>
              <Time
                format={{
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }}
              >
                {start}
              </Time>
            </Box>
            <Text
              span
              color="gray.4"
              sx={({ fontFamilyMonospace }) => ({
                fontFamily: fontFamilyMonospace,
              })}
            >
              {" / "}
            </Text>{" "}
            <Text>{durationHumanizer(durationSeconds * 1000)}</Text>
          </Group>
        </MantineProvider>
      </Group>
      {!!description && (
        <Linkify<TextProps, JSXElementConstructor<TextProps>>
          as={Text}
          options={{
            render: ({ content, attributes }) => (
              <Anchor
                target="_blank"
                rel="noopener noreferrer nofollow"
                {...attributes}
              >
                {content}
              </Anchor>
            ),
          }}
          size="sm"
          color="dimmed"
          lineClamp={4}
          sx={{ whiteSpace: "pre-wrap" }}
        >
          {description}
        </Linkify>
      )}
      <Space h={6} />
      {activity ? (
        <Button
          component={Link}
          href={activity.url}
          leftIcon={<RightArrowIcon />}
        >
          Go To Activity
        </Button>
      ) : (
        <Tooltip
          label="You must be the event organizer to create an activity."
          withArrow
          disabled={viewerIsOrganizer}
        >
          <Box display="inline-block">
            <ActivityCreateButton
              googleEventId={eventId}
              onCreate={onCreateActivity}
              disabled={!viewerIsOrganizer}
            />
          </Box>
        </Tooltip>
      )}
    </Card>
  );
};

export default GoogleEventCard;
