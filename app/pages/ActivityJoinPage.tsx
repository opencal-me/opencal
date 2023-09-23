import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import humanizeDuration from "humanize-duration";
import { Marker } from "react-map-gl";

import LocationIcon from "~icons/heroicons/map-pin-20-solid";
import ShowMoreIcon from "~icons/heroicons/chevron-double-down-20-solid";
import HideIcon from "~icons/heroicons/chevron-double-up-20-solid";

import { /* Affix, */ Avatar, Spoiler, Text } from "@mantine/core";
// import { useIntersection } from "@mantine/hooks";

import type { ActivityJoinPageQuery } from "~/helpers/graphql";

// import ReservationFooter from "~/components/ReservationFooter";
import Map from "~/components/Map";
import PageContainer from "~/components/PageContainer";
import HTMLDescription from "~/components/HTMLDescription";
import { ReservationCreateForm } from "~/components/ReservationCreateForm";

export type ActivityJoinPageProps = PagePropsWithData<ActivityJoinPageQuery>;

const ActivityJoinPage: PageComponent<ActivityJoinPageProps> = ({
  data: { activity },
}) => {
  invariant(activity, "Missing activity");
  const {
    owner,
    start,
    durationSeconds,
    name,
    descriptionHtml,
    coordinates,
    address,
    addressPlaceName,
    tags,
    url,
    isOwnedByViewer,
    openings,
  } = activity;
  const hasOpenings = openings > 0;

  // == Mantine
  const theme = useMantineTheme();

  // == Routing
  const router = useRouter();

  // == Start
  const startDateTime = useMemo(() => DateTime.fromISO(start), [start]);
  const startDateLabel = useMemo(() => {
    if (startDateTime.hasSame(DateTime.local(), "day")) {
      return "Today";
    }
    return startDateTime.toLocaleString({
      month: "short",
      day: "numeric",
    });
  }, [startDateTime]);

  // == Duration
  const durationLabel = useMemo(
    () => humanizeDuration(durationSeconds * 1000),
    [durationSeconds],
  );

  // == Reservation Footer
  // const { entry: footerIntersection, ref: footerRef } =
  //   useIntersection<HTMLDivElement>({
  //     threshold: 0,
  //   });

  return (
    <>
      <PageContainer size={570} withGutter gutterSize="xl" sx={{ flexGrow: 1 }}>
        <Stack spacing={32}>
          {isOwnedByViewer && (
            <Alert
              title="You are previewing the public page for this activity"
              // variant="filled"
              styles={({ fontSizes }) => ({
                title: {
                  fontSize: fontSizes.md,
                  marginBottom: rem(4),
                  lineHeight: 1.3,
                },
              })}
            >
              To manage this activity,{" "}
              <Anchor
                inherit
                component={Link}
                href={url}
                fw={600}
                // sx={({ transitionTimingFunction, fn }) => ({
                //   textDecoration: "underline",
                //   transition: `color 150ms ${transitionTimingFunction}`,
                //   "&:hover": {
                //     color: fn.lighten(fn.primaryColor(), 0.75),
                //   },
                // })}
              >
                click here
              </Anchor>
              .
            </Alert>
          )}
          <Stack
            bg="white"
            p="md"
            sx={({ radius }) => ({ borderRadius: radius.md })}
          >
            <Group spacing="xs">
              {resolve(() => {
                const { avatarUrl, initials } = owner;
                return (
                  !!avatarUrl && (
                    <Avatar src={avatarUrl} size="sm" color="brand" radius="xl">
                      {initials}
                    </Avatar>
                  )
                );
              })}
              <Text color="gray.7" size="sm">
                <Anchor
                  component={Link}
                  href={owner.url}
                  color="dark"
                  weight={600}
                  sx={({ transitionTimingFunction, fn }) => ({
                    textDecoration: "underline",
                    transition: `color 150ms ${transitionTimingFunction}`,
                    "&:hover": {
                      color: fn.primaryColor(),
                    },
                  })}
                >
                  {owner.firstName}
                </Anchor>{" "}
                wants you to join them at
              </Text>
            </Group>
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
                        sx={{ textTransform: "none" }}
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
            <Tooltip
              label="Sorry, this event is full!"
              withArrow
              disabled={hasOpenings}
            >
              <Button
                variant="gradient"
                gradient={{
                  from: theme.colors.brand[theme.fn.primaryShade()],
                  to: theme.colors.pink[theme.fn.primaryShade()],
                }}
                size="lg"
                fw={800}
                mt="xs"
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

            {/* : (
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
          </Stack>
        </Stack>
      </PageContainer>
      {/* <Box ref={footerRef} pt="md">
        <ReservationFooter {...{ activity }} />
      </Box>
      <Affix position={{ left: 0, bottom: 0, right: 0 }}>
        <Transition
          transition="slide-up"
          mounted={
            footerIntersection ? !footerIntersection.isIntersecting : false
          }
        >
          {style => <ReservationFooter {...{ activity, style }} />}
        </Transition>
      </Affix> */}
    </>
  );
};

ActivityJoinPage.layout = buildLayout<ActivityJoinPageProps>(
  (page, { data: { viewer, activity } }) => {
    invariant(activity, "Missing activity");
    const { owner } = activity;
    return (
      <AppLayout
        title={activity.name}
        noIndex
        breadcrumbs={
          activity.isOwnedByViewer
            ? [
                { title: "Home", href: "/home" },
                { title: activity.name, href: activity.url },
                { title: "Public page preview", href: activity.joinUrl },
              ]
            : [
                { title: `${owner.firstName}'s activities`, href: owner.url },
                { title: activity.name, href: activity.joinUrl },
              ]
        }
        padding={0}
        styles={({ colors, white, fn }) => ({
          body: {
            backgroundImage: fn.linearGradient(
              120,
              colors.brand[fn.primaryShade()],
              colors.pink[fn.primaryShade()],
            ),
            ".mantine-Breadcrumbs-root": {
              ".mantine-Breadcrumbs-breadcrumb": {
                color: white,
              },
              ".mantine-Breadcrumbs-separator": {
                color: fn.rgba(white, 0.5),
              },
            },
          },
        })}
        {...{ viewer }}
      >
        {page}
      </AppLayout>
    );
  },
);

export default ActivityJoinPage;
