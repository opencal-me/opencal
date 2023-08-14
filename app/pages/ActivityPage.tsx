import type { JSXElementConstructor } from "react";
import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import Linkify from "linkify-react";
import { Marker } from "react-map-gl";

import LocationIcon from "~icons/heroicons/map-pin-20-solid";
import ShowMoreIcon from "~icons/heroicons/chevron-double-down-20-solid";
import HideIcon from "~icons/heroicons/chevron-double-up-20-solid";

import { Affix, Avatar, Spoiler, Text } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import type { TextProps } from "@mantine/core";

import type { ActivityPageQuery } from "~/helpers/graphql";

import ReservationFooter from "~/components/ReservationFooter";
import Map from "~/components/Map";
import PageContainer from "~/components/PageContainer";

export type ActivityPageProps = PagePropsWithData<ActivityPageQuery>;

const ActivityPage: PageComponent<ActivityPageProps> = ({
  data: { activity },
}) => {
  invariant(activity, "Missing activity");
  const { owner, start, title, description, coordinates, address } = activity;

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
      <PageContainer size="xs" withGutter>
        <Stack>
          <Group spacing="xs">
            {resolve(() => {
              const { avatarUrl, name } = owner;
              return (
                !!avatarUrl && (
                  <Avatar src={avatarUrl} size="sm" radius="xl">
                    {name}
                  </Avatar>
                )
              );
            })}
            <Text size="sm">
              <Text span weight={600}>
                {owner.name}
              </Text>{" "}
              wants you to join them
            </Text>
          </Group>
          <Text color="red" size="sm">
            {startDateLabel} at{" "}
            {startDateTime.toLocaleString({
              hour: "numeric",
              minute: "numeric",
            })}
          </Text>
          <Title size="h3" lh={1.3}>
            {title}
          </Title>
          {description && (
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
                color="gray.7"
                sx={{ whiteSpace: "pre-wrap" }}
              >
                {description}
              </Linkify>
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
          mounted={!footerIntersection?.isIntersecting}
        >
          {style => <ReservationFooter {...{ activity, style }} />}
        </Transition>
      </Affix>
    </>
  );
};

ActivityPage.layout = buildLayout<ActivityPageProps>(
  (page, { data: { viewer } }) => (
    <AppLayout padding={0} {...{ viewer }}>
      {page}
    </AppLayout>
  ),
);

export default ActivityPage;
