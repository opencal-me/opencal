import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Text } from "@mantine/core";

import type { HomePageQuery } from "~/helpers/graphql";

// import GoogleEvents from "~/components/GoogleEvents";
import ActivityCard from "~/components/ActivityCard";
import MobileSubscriptionBadge from "~/components/MobileSubscriptionBadge";
import ActivityCreateButton from "~/components/ActivityCreateButton";

export type HomePageProps = PagePropsWithData<HomePageQuery>;

const HomePage: PageComponent<HomePageProps> = ({ data: { viewer } }) => {
  invariant(viewer, "Missing viewer");
  const { activities, url, mobileSubscriptions } = viewer;
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
              fontSize: fontSizes.lg,
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
      <Stack spacing={4}>
        <Title order={2} size="h3">
          Your Activities
        </Title>
        <Stack spacing="xs">
          {!isEmpty(activities) ? (
            activities.map(activity => (
              <ActivityCard key={activity.id} {...{ activity }} />
            ))
          ) : (
            <EmptyCard itemLabel="activities" />
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
