import type { FC, ReactNode } from "react";
import humanizeDuration from "humanize-duration";

import { Text } from "@mantine/core";
import type { BoxProps } from "@mantine/core";

import type { ActivityCardActivityFragment } from "~/helpers/graphql";

import HTMLDescription from "./HTMLDescription";

export type ActivityCardProps = Omit<BoxProps, "children"> & {
  readonly activity: ActivityCardActivityFragment;
  readonly topSection?: ReactNode;
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

const ActivityCard: FC<ActivityCardProps> = ({
  activity: {
    name,
    tags,
    descriptionHtml,
    start,
    end,
    durationSeconds,
    url,
    joinUrl,
    isOwnedByViewer,
  },
  topSection,
  ...otherProps
}) => {
  const isOver = useMemo(() => {
    const dateTime = DateTime.fromISO(end);
    return dateTime.diffNow("seconds").seconds <= 0;
  }, [end]);

  return (
    <AnchorContainer
      component={Link}
      href={isOwnedByViewer ? url : joinUrl}
      pos="relative"
      {...(isOver && { mt: 6 })}
      {...otherProps}
    >
      <Card
        withBorder
        sx={({ colors, fn }) => ({
          cursor: "pointer",
          ...(isOver && {
            "&[data-with-border]:hover": {
              borderColor: colors.red[fn.primaryShade()],
            },
          }),
        })}
      >
        {topSection}
        <Group align="start" noWrap>
          <Text weight={500} lh={1.2} sx={{ flexGrow: 1 }}>
            {name}
          </Text>
          <Group
            spacing={6}
            noWrap
            lh={1.4}
            sx={({ fontSizes, colors, fn }) => ({
              flexShrink: 0,
              fontSize: fontSizes.sm,
              color: isOver ? colors.red[5] : fn.dimmed(),
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
              sx={({ fontFamilyMonospace, colors }) => ({
                fontFamily: fontFamilyMonospace,
                color: isOver ? colors.red[3] : colors.gray[4],
              })}
            >
              {" / "}
            </Text>{" "}
            <Text>{durationHumanizer(durationSeconds * 1000)}</Text>
          </Group>
        </Group>
        {!isEmpty(tags) && (
          <Group spacing={4} mb={8} mt={2}>
            {tags.map(tag => (
              <Badge key={tag} size="xs" color="gray" radius="sm">
                {tag}
              </Badge>
            ))}
          </Group>
        )}
        {!!descriptionHtml && (
          <HTMLDescription mah={120}>{descriptionHtml}</HTMLDescription>
        )}
      </Card>
      {isOver && (
        <Badge
          color="gray"
          variant="outline"
          pos="absolute"
          top={-9}
          right={16}
          sx={({ white, colors }) => ({
            color: colors.red[5],
            backgroundColor: white,
            borderColor: colors.gray[3],
          })}
        >
          Recently Ended
        </Badge>
      )}
    </AnchorContainer>
  );
};

export default ActivityCard;
