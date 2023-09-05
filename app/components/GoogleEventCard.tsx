import type { FC } from "react";
import humanizeDuration from "humanize-duration";
import RightArrowIcon from "~icons/heroicons/arrow-right-20-solid";

import { Text } from "@mantine/core";
import type { BoxProps } from "@mantine/core";

import type {
  ActivityCreateButtonActivityFragment,
  GoogleEventCardEventFragment,
} from "~/helpers/graphql";

import HTMLDescription from "./HTMLDescription";
import GoogleEventConvertButton from "./GoogleEventConvertButton";

export type GoogleEventCardProps = Omit<BoxProps, "children"> & {
  readonly event: GoogleEventCardEventFragment;
  readonly onConvert: (activity: ActivityCreateButtonActivityFragment) => void;
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
    descriptionHtml,
    start,
    durationSeconds,
    activity,
    isOrganizedByViewer,
    isRecurring,
  },
  onConvert,
  sx,
  ...otherProps
}) => {
  const isEligibleForActivity = isOrganizedByViewer && !isRecurring;
  return (
    <Card
      withBorder
      sx={[
        ...packSx(sx),
        ({ fn }) => ({
          ...(activity && {
            "&[data-with-border]": {
              borderColor: fn.primaryColor(),
            },
          }),
        }),
      ]}
      {...otherProps}
    >
      <Group align="start" noWrap>
        <Text weight={500} lh={1.2} sx={{ flexGrow: 1 }}>
          {title ?? "(no title)"}
        </Text>
        <Group
          spacing={6}
          noWrap
          lh={1.4}
          sx={({ fontSizes, fn }) => ({
            flexShrink: 0,
            fontSize: fontSizes.sm,
            color: fn.dimmed(),
            lh: 1.4,
          })}
        >
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
      </Group>
      {!!descriptionHtml && (
        <HTMLDescription mah={120}>{descriptionHtml}</HTMLDescription>
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
          label="This event cannot be turned into an OpenCal activity."
          {...(!isOrganizedByViewer && {
            label: "You must be the event organizer to create an activity.",
          })}
          {...(isRecurring && {
            label:
              "Recurring events cannot be turned into an OpenCal activity.",
          })}
          withArrow
          disabled={isEligibleForActivity}
        >
          <Box display="inline-block">
            <GoogleEventConvertButton
              googleEventId={eventId}
              variant="light"
              disabled={!isEligibleForActivity}
              {...{ onConvert }}
            />
          </Box>
        </Tooltip>
      )}
    </Card>
  );
};

export default GoogleEventCard;
