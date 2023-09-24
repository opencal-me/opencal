import type { FC, ReactNode } from "react";
import type { InertiaLinkProps } from "@inertiajs/react";
import humanizeDuration from "humanize-duration";

import { Text } from "@mantine/core";
import type { BoxProps } from "@mantine/core";

import type { ActivityCardActivityFragment } from "~/helpers/graphql";

import HTMLDescription from "./HTMLDescription";

export type ActivityCardProps = Omit<BoxProps, "children"> &
  Pick<InertiaLinkProps, "href"> & {
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
    groups,
  },
  href,
  topSection,
  ...otherProps
}) => {
  const isOver = useMemo(() => {
    const dateTime = DateTime.fromISO(end);
    return dateTime.diffNow("seconds").seconds <= 0;
  }, [end]);

  // == Duration
  const durationLabel = useMemo(
    () => durationHumanizer(durationSeconds * 1000),
    [durationSeconds],
  );

  return (
    <AnchorContainer
      component={Link}
      pos="relative"
      {...(isOver && { mt: 6 })}
      {...{ href }}
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
          <Group spacing={8} sx={{ flexGrow: 1 }}>
            <Text weight={500} lh={1.3} sx={{ textTransform: "none" }}>
              {name}
            </Text>
            {groups.map(({ id: groupId, handle }) => (
              <Text
                key={groupId}
                color="gray"
                size="xs"
                sx={({ fontFamilyMonospace }) => ({
                  fontFamily: fontFamilyMonospace,
                })}
              >
                @{handle}
              </Text>
            ))}
          </Group>
          <Group
            spacing={6}
            noWrap
            lh={1.3}
            sx={({ fontSizes, colors, fn }) => ({
              flexShrink: 0,
              fontSize: fontSizes.sm,
              color: isOver ? colors.red[5] : fn.dimmed(),
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
              color={isOver ? "red.3" : "gray.3"}
              sx={({ fontFamilyMonospace }) => ({
                fontFamily: fontFamilyMonospace,
              })}
            >
              {" / "}
            </Text>{" "}
            <Text>{durationLabel}</Text>
          </Group>
        </Group>
        {!isEmpty(tags) && (
          <Group spacing={4} mb={8} mt={4}>
            {tags.map(tag => (
              <Badge key={tag} size="xs" color="gray" radius="sm">
                {tag}
              </Badge>
            ))}
          </Group>
        )}
        {!!descriptionHtml && (
          <HTMLDescription mah={120} mt={4} sx={{ textTransform: "none" }}>
            {descriptionHtml}
          </HTMLDescription>
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
