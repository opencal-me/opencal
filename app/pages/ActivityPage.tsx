import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Marker } from "react-map-gl";

import LocationIcon from "~icons/heroicons/map-pin-20-solid";
import ShowMoreIcon from "~icons/heroicons/chevron-double-down-20-solid";
import HideIcon from "~icons/heroicons/chevron-double-up-20-solid";

import { Affix, Avatar, Spoiler, Text } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";

import type { ActivityPageQuery } from "~/helpers/graphql";

import ReservationFooter from "~/components/ReservationFooter";
import Map from "~/components/Map";
import PageContainer from "~/components/PageContainer";
import HTMLDescription from "~/components/HTMLDescription";

export type ActivityPageProps = PagePropsWithData<ActivityPageQuery>;

const ActivityPage: PageComponent<ActivityPageProps> = ({
  data: { activity },
}) => {
  invariant(activity, "Missing activity");
  const { owner, start, name, descriptionHtml, coordinates, address } =
    activity;

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

  // == Reservation Footer
  const { entry: footerIntersection, ref: footerRef } =
    useIntersection<HTMLDivElement>({
      threshold: 0,
    });

  return (
    <>
      <PageContainer size="xs" withGutter sx={{ flexGrow: 1 }}>
        <Stack>
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
            <Text size="sm">
              <Anchor
                component={Link}
                href={owner.url}
                weight={600}
                sx={({ transitionTimingFunction, fn }) => ({
                  textDecoration: "underline",
                  transition: `color 150ms ${transitionTimingFunction}`,
                  "&:hover": {
                    color: fn.darken(fn.primaryColor(), 0.25),
                  },
                })}
              >
                {owner.name}
              </Anchor>{" "}
              wants you to join them
            </Text>
          </Group>
          <Text color="red" size="sm">
            {startDateLabel} at{" "}
            <Time format={{ hour: "numeric", minute: "numeric" }}>
              {startDateTime}
            </Time>
          </Text>
          <Title size="h3" lh={1.3}>
            {name}
          </Title>
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
          {coordinates && (
            <Stack spacing="xs">
              <Box
                w="100%"
                h={275}
                sx={({ radius, colors }) => ({
                  borderRadius: radius.md,
                  overflow: "hidden",
                  border: `${rem(1)} solid ${colors.gray[3]}`,
                })}
              >
                <Map initialViewState={{ ...coordinates, zoom: 12.5 }}>
                  <Marker {...coordinates} />
                </Map>
              </Box>
              {!!address && (
                <Group align="center" spacing={6}>
                  <Text component={LocationIcon} color="brand" />
                  <Text size="sm" weight={500}>
                    {address}
                  </Text>
                </Group>
              )}
            </Stack>
          )}
        </Stack>
      </PageContainer>
      <Box ref={footerRef} pt="md">
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
      </Affix>
    </>
  );
};

ActivityPage.layout = buildLayout<ActivityPageProps>(
  (page, { data: { viewer, activity } }) => {
    invariant(activity, "Missing activity");
    return (
      <AppLayout
        noIndex
        padding={0}
        {...(viewer && {
          breadcrumbs: [
            { title: "Home", href: "/home" },
            { title: activity.name, href: activity.url },
          ],
        })}
        {...{ viewer }}
      >
        {page}
      </AppLayout>
    );
  },
);

export default ActivityPage;
