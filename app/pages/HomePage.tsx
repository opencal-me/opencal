import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import {
  ActionIcon,
  Avatar,
  Code,
  CopyButton,
  Image,
  Text,
} from "@mantine/core";
import CalendarIcon from "~icons/heroicons/calendar-days-20-solid";
import CopyIcon from "~icons/heroicons/clipboard-document-20-solid";

import type { HomePageQuery } from "~/helpers/graphql";

import Activities from "~/components/Activities";
import ActivityCard from "~/components/ActivityCard";
import ActivityCreateButton from "~/components/ActivityCreateButton";
import GroupCard from "~/components/GroupCard";
import GroupCreateButton from "~/components/GroupCreateButton";
import MobileSubscriptionBadge from "~/components/MobileSubscriptionBadge";

import createFromCalendarImageSrc from "~/assets/images/create-from-calendar.gif";

export type HomePageProps = PagePropsWithData<HomePageQuery>;

const HomePage: PageComponent<HomePageProps> = ({
  data: { viewer, activities: publicActivities },
}) => {
  invariant(viewer, "Missing viewer");
  const { activities, groups, mobileSubscriptions, url, calendarUrl } = viewer;
  const urlLabel = useMemo(() => {
    const u = new URL(url);
    return `${u.host}${u.pathname}`;
  }, [url]);

  // == Routing
  const router = useRouter();

  return (
    <Stack spacing={32}>
      {!isEmpty(activities) && (
        <Alert
          variant="filled"
          title={
            <Text span lineClamp={1}>
              Your profile is live:{" "}
              <Anchor
                component={Link}
                href={url}
                sx={({ white, transitionTimingFunction, fn }) => ({
                  color: white,
                  textDecoration: "underline",
                  wordBreak: "break-all",
                  transition: `color 150ms ${transitionTimingFunction}`,
                  "&:hover": {
                    color: fn.lighten(fn.primaryColor(), 0.75),
                  },
                })}
              >
                {urlLabel}
              </Anchor>
            </Text>
          }
          styles={({ colors, fontSizes }) => ({
            title: {
              fontSize: fontSizes.md,
              marginBottom: rem(4),
            },
            message: {
              color: colors.brand[0],
            },
          })}
        >
          Share this link with the people you want to hang out with more :)
        </Alert>
      )}
      <Stack spacing="xs">
        <Box>
          <Title order={2} size="h3">
            What your friends are up to
          </Title>
          <Text size="sm" color="dimmed" lh={1.3}>
            Copy the link below, and click the button below to add it to your
            Google Calendar.
          </Text>
        </Box>
        <Group spacing={8} noWrap>
          <Code block pos="relative">
            {calendarUrl}
          </Code>
          <CopyButton value={calendarUrl}>
            {({ copy, copied }) => (
              <Tooltip label={copied ? "Copied!" : "Copy link"} withArrow>
                <ActionIcon color="brand" onClick={copy}>
                  <CopyIcon />
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
        <Box>
          <Button
            component="a"
            href="https://calendar.google.com/calendar/r/settings/addbyurl"
            target="_blank"
            rel="noopener noreferrer nofollow"
            variant="default"
            leftIcon={<CalendarIcon />}
          >
            Add to Google Calendar
          </Button>
        </Box>
      </Stack>
      <Stack spacing="xs">
        <Box>
          <Title order={2} size="h3">
            What you&apos;re up to
          </Title>
          <Text size="sm" color="dimmed" lh={1.3}>
            Any Google calendar event with <Code>[open]</Code> in the title,
            will automatically become an OpenCal activity.
          </Text>
        </Box>
        <Stack spacing="xs">
          <Activities
            renderItem={activity => {
              const { id: activityId, url } = activity;
              return (
                <ActivityCard key={activityId} href={url} {...{ activity }} />
              );
            }}
            empty={
              <Card withBorder>
                <Stack align="center" my="sm">
                  <Text size="sm" align="center" maw={375} lh={1.3}>
                    <Text span color="dark" weight={600}>
                      You don&apos;t have any OpenCal activities
                    </Text>
                    <br />
                    <Text span color="dimmed">
                      To create an OpenCal activity, open your calendar and
                      create an event with <Code>[open]</Code> in the title.
                    </Text>
                  </Text>
                  <Image
                    src={createFromCalendarImageSrc}
                    width={375}
                    radius="md"
                  />
                  <Text
                    size="sm"
                    align="center"
                    color="dimmed"
                    maw={375}
                    lh={1.3}
                  >
                    When you&apos;re done, it&apos;ll show up here
                    <br />& you&apos;ll get an email about it :)
                  </Text>
                  <Button
                    component="a"
                    href="https://calendar.google.com/calendar/r/eventedit"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    leftIcon={<OpenExternalIcon />}
                  >
                    Try it in Google Calendar
                  </Button>
                </Stack>
              </Card>
            }
            {...{ activities }}
          />
          {!isEmpty(activities) && (
            <Box>
              <ActivityCreateButton
              // onCreate={({ url }) => {
              //   router.visit(url);
              // }}
              />
            </Box>
          )}
        </Stack>
      </Stack>
      <Stack spacing="xs">
        <Title order={2} size="h3">
          Your groups
        </Title>
        <Stack spacing="xs">
          {!isEmpty(groups) ? (
            groups.map(group => {
              const { id: groupId, url } = group;
              return <GroupCard key={groupId} href={url} {...{ group }} />;
            })
          ) : (
            <EmptyCard itemLabel="groups" />
          )}
          <Box>
            <GroupCreateButton
              onCreate={({ url }) => {
                router.visit(url);
              }}
            />
          </Box>
        </Stack>
      </Stack>
      {!isEmpty(publicActivities) && (
        <Stack spacing="xs">
          <Box>
            <Title order={2} size="h3">
              Community activities
            </Title>
            <Text size="sm" color="dimmed" lh={1.4}>
              Activities that users on OpenCal have shared to the world (by
              tagging them as <Code>[open public]</Code> in their calendar).
            </Text>
          </Box>
          <Stack spacing="xs">
            {publicActivities.map(activity => {
              const { id: activityId, owner } = activity;
              return (
                <ActivityCard
                  key={activityId}
                  href={activity.joinUrl}
                  topSection={
                    <Card.Section inheritPadding>
                      <Group spacing={8} py={8}>
                        <Avatar src={owner.avatarUrl} size="xs" radius="xl">
                          {owner.initials}
                        </Avatar>
                        <Text size="sm" color="gray.6">
                          {owner.firstName}&apos;s gonna be at
                        </Text>
                      </Group>
                    </Card.Section>
                  }
                  {...{ activity }}
                />
              );
            })}
          </Stack>
        </Stack>
      )}
      {!isEmpty(mobileSubscriptions) && (
        <Stack spacing={8}>
          <Box>
            <Title order={2} size="h3">
              Your Subscribers
            </Title>
            <Text size="sm" color="dimmed">
              People that get notified when you create a new activity.
            </Text>
          </Box>
          <Group>
            {mobileSubscriptions.map(subscription => (
              <MobileSubscriptionBadge
                key={subscription.id}
                onDelete={() => {
                  router.reload({ preserveScroll: true });
                }}
                {...{ subscription }}
              />
            ))}
          </Group>
        </Stack>
      )}
    </Stack>
  );
};

HomePage.layout = buildLayout<HomePageProps>((page, { data: { viewer } }) => (
  <AppLayout
    title="Home"
    breadcrumbs={[{ title: "Home", href: "/home" }]}
    withContainer
    containerSize="xs"
    withGutter
    {...{ viewer }}
  >
    {page}
  </AppLayout>
));

export default HomePage;
