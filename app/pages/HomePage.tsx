import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Code, Image, Text } from "@mantine/core";

import type { HomePageQuery } from "~/helpers/graphql";

// import GoogleEvents from "~/components/GoogleEvents";
import ActivityCard from "~/components/ActivityCard";
import MobileSubscriptionBadge from "~/components/MobileSubscriptionBadge";
import ActivityCreateButton from "~/components/ActivityCreateButton";

import createFromCalendarImageSrc from "~/assets/images/create-from-calendar.gif";

export type HomePageProps = PagePropsWithData<HomePageQuery>;

const HomePage: PageComponent<HomePageProps> = ({ data: { viewer } }) => {
  invariant(viewer, "Missing viewer");
  const { activities, mobileSubscriptions, url } = viewer;
  const urlLabel = useMemo(() => {
    const u = new URL(url);
    return `${u.host}${u.pathname}`;
  }, [url]);

  // == Routing
  const router = useRouter();

  return (
    <Stack spacing="xl">
      {!isEmpty(activities) && (
        <Alert
          variant="filled"
          title={
            <Text span lineClamp={1}>
              Your profile is live:{" "}
              <Anchor
                component={Link}
                href={url}
                sx={({ white }) => ({
                  color: white,
                  textDecoration: "underline",
                  wordBreak: "break-all",
                })}
              >
                {urlLabel}
              </Anchor>
            </Text>
          }
          styles={({ colors, fontSizes }) => ({
            title: {
              fontSize: fontSizes.md,
              marginBottom: 0,
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
            Your Activities
          </Title>
          <Text size="sm" color="dimmed" lh={1.3}>
            Any Google calendar event with{" "}
            <Code
              color="dark"
              sx={({ white, colors }) => ({
                color: white,
                backgroundColor: colors.dark[3],
              })}
            >
              open
            </Code>{" "}
            in the title, will automatically become an OpenCal activity.
          </Text>
        </Box>
        <Stack spacing="xs">
          {!isEmpty(activities) ? (
            activities.map(activity => (
              <ActivityCard key={activity.id} {...{ activity }} />
            ))
          ) : (
            <Card withBorder>
              <Stack align="center" my="sm">
                <Text size="sm" align="center" maw={375} lh={1.3}>
                  <Text span color="dark" weight={600}>
                    You don&apos;t have any OpenCal activities
                  </Text>
                  <br />
                  <Text span color="dimmed">
                    Why not try making an <Code>[open]</Code> event in your
                    calendar?
                  </Text>
                </Text>
                <Image
                  src={createFromCalendarImageSrc}
                  width={375}
                  radius="md"
                />
              </Stack>
            </Card>
          )}
          <Box>
            <ActivityCreateButton
              onCreate={({ url }) => {
                router.visit(url);
              }}
            />
          </Box>
        </Stack>
      </Stack>
      {/* <GoogleEvents
        onCreateActivity={({ url }) => {
          router.visit(url);
        }}
      /> */}
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
