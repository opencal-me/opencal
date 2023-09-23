import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { CopyButton, Spoiler, Text } from "@mantine/core";
import { Marker } from "react-map-gl";
import humanizeDuration from "humanize-duration";

import HideIcon from "~icons/heroicons/chevron-double-up-20-solid";
import JoinIcon from "~icons/heroicons/hand-raised-20-solid";
import LocationIcon from "~icons/heroicons/map-pin-20-solid";
import ProfileIcon from "~icons/heroicons/user-20-solid";
import ShowMoreIcon from "~icons/heroicons/chevron-double-down-20-solid";
import StoryIcon from "~icons/heroicons/photo-20-solid";

import type { ActivityPageQuery } from "~/helpers/graphql";

import Map from "~/components/Map";
import HTMLDescription from "~/components/HTMLDescription";
import ActivityReservations from "~/components/ActivityReservations";

export type ActivityPageProps = PagePropsWithData<ActivityPageQuery>;

const ActivityPage: PageComponent<ActivityPageProps> = ({
  data: { activity },
}) => {
  invariant(activity, "Missing activity");
  const {
    name,
    start,
    durationSeconds,
    descriptionHtml,
    coordinates,
    address,
    addressPlaceName,
    tags,
    owner,
    joinUrl,
    shareUrl,
  } = activity;

  // == Start
  const startDateTime = useMemo(() => DateTime.fromISO(start), [start]);
  const startDateLabel = useMemo(() => {
    if (startDateTime.hasSame(DateTime.local(), "day")) {
      return "Today";
    }
    return startDateTime.toLocaleString({
      month: "long",
      day: "numeric",
    });
  }, [startDateTime]);

  // == Duration
  const durationLabel = useMemo(
    () => humanizeDuration(durationSeconds * 1000),
    [durationSeconds],
  );

  return (
    <Stack spacing={32}>
      <Alert
        title="You are viewing the admin page for this activity"
        variant="filled"
        styles={({ fontSizes }) => ({
          title: {
            fontSize: fontSizes.md,
            marginBottom: rem(4),
            lineHeight: 1.3,
          },
        })}
      >
        To see the public page for your activity,{" "}
        <Anchor
          inherit
          color="white"
          component={Link}
          href={joinUrl}
          fw={600}
          sx={({ transitionTimingFunction, fn }) => ({
            textDecoration: "underline",
            transition: `color 150ms ${transitionTimingFunction}`,
            "&:hover": {
              color: fn.lighten(fn.primaryColor(), 0.75),
            },
          })}
        >
          click here
        </Anchor>
        .
      </Alert>
      <Stack>
        <Box>
          <Title size="h3" lh={1.3} sx={{ textTransform: "none" }}>
            {name}
          </Title>
          <Group
            spacing={6}
            noWrap
            sx={({ fontSizes, fn }) => ({
              flexShrink: 0,
              fontSize: fontSizes.sm,
              color: fn.primaryColor(),
            })}
          >
            <Text size="sm">
              {startDateLabel} at{" "}
              <Time format={{ hour: "numeric", minute: "numeric" }}>
                {startDateTime}
              </Time>
            </Text>
            <Text
              span
              color="gray.4"
              sx={({ fontFamilyMonospace }) => ({
                fontFamily: fontFamilyMonospace,
              })}
            >
              {" / "}
            </Text>{" "}
            <Text color="gray">{durationLabel}</Text>
          </Group>
          {!isEmpty(tags) && (
            <Group spacing={4} mt={4}>
              {tags.map(tag => (
                <Badge key={tag} color="gray" radius="sm">
                  {tag}
                </Badge>
              ))}
            </Group>
          )}
        </Box>
        {coordinates && (
          <Stack spacing="xs">
            <Box
              w="100%"
              h={175}
              sx={({ radius, colors }) => ({
                borderRadius: radius.md,
                overflow: "hidden",
                border: `${rem(1)} solid ${colors.gray[3]}`,
              })}
            >
              <Map initialViewState={{ ...coordinates, zoom: 11.5 }}>
                <Marker {...coordinates} />
              </Map>
            </Box>
            {!!address && (
              <Group align="start" spacing={6}>
                <Text component={LocationIcon} color="brand" mt={1} />
                <Box>
                  <Text
                    size="sm"
                    weight={500}
                    color="dark"
                    lh={1.3}
                    sx={{
                      textTransform: "none",
                    }}
                  >
                    {addressPlaceName ?? address}
                  </Text>
                  {!!addressPlaceName && (
                    <Text
                      size="xs"
                      color="dimmed"
                      lh={1.3}
                      sx={{ textTransform: "none" }}
                    >
                      {address}
                    </Text>
                  )}
                </Box>
              </Group>
            )}
          </Stack>
        )}
        {!!descriptionHtml && (
          <Spoiler
            maxHeight={200}
            showLabel={
              <Group spacing={4}>
                <Text component={ShowMoreIcon} />
                <Text span>Show more</Text>
              </Group>
            }
            hideLabel={
              <Group spacing={4}>
                <Text component={HideIcon} />
                <Text span>Hide</Text>
              </Group>
            }
            styles={({ fontSizes }) => ({
              control: {
                fontSize: fontSizes.sm,
              },
            })}
          >
            <HTMLDescription>{descriptionHtml}</HTMLDescription>
          </Spoiler>
        )}
        {/* (
          <Card withBorder py="lg">
            <Stack align="center" spacing={4}>
              <Text
                span
                color="gray.7"
                weight={600}
                sx={({ fontFamilyMonospace }) => ({
                  fontFamily: fontFamilyMonospace,
                })}
              >
                ¯\_(ツ)_/¯
              </Text>
              <Text size="sm" color="dimmed">
                This activity has no description
              </Text>
            </Stack>
          </Card>
              ) */}
        <ActivityReservations {...{ activity }} />
        <Box>
          <Title order={3} size="h4">
            Share your event!
          </Title>
          <Stack spacing="sm">
            <Stack spacing={8}>
              <Text size="sm" color="gray.7" lh={1.3}>
                You can share a link to{" "}
                <Anchor component={Link} href={joinUrl} inherit fw={500}>
                  join this activity
                </Anchor>
                , or to{" "}
                <Anchor component={Link} href={owner.url} inherit fw={500}>
                  your profile page
                </Anchor>{" "}
                with all your activities.
              </Text>
              <Group spacing={8}>
                <CopyButton value={joinUrl}>
                  {({ copy, copied }) => (
                    <Button
                      variant="outline"
                      leftIcon={<JoinIcon />}
                      onClick={copy}
                    >
                      {copied ? "Join link copied!" : "Copy join link"}
                    </Button>
                  )}
                </CopyButton>
                <CopyButton value={owner.url}>
                  {({ copy, copied }) => (
                    <Button
                      variant="outline"
                      leftIcon={<ProfileIcon />}
                      onClick={copy}
                    >
                      {copied ? "Profile link copied!" : "Copy profile link"}
                    </Button>
                  )}
                </CopyButton>
              </Group>
            </Stack>
            <Stack spacing={8}>
              <Text size="sm" color="gray.7" lh={1.3}>
                You can also share this activity as an Instagram story.
              </Text>
              <Box>
                <Button
                  component={Link}
                  href={shareUrl}
                  variant="outline"
                  leftIcon={<StoryIcon />}
                >
                  Make an Instagram story
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

ActivityPage.layout = buildLayout<ActivityPageProps>(
  (page, { data: { viewer, activity } }) => {
    invariant(activity, "Missing activity");
    return (
      <AppLayout
        title={activity.name}
        breadcrumbs={[
          { title: "Home", href: "/home" },
          { title: activity.name, href: activity.url },
        ]}
        withContainer
        containerSize="xs"
        withGutter
        {...{ viewer }}
      >
        {page}
      </AppLayout>
    );
  },
);

export default ActivityPage;
