import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";

import type { HomePageQuery } from "~/helpers/graphql";

import HomePageGoogleEvents from "~/components/HomePageGoogleEvents";
import ActivityCard from "~/components/ActivityCard";

export type HomePageProps = PagePropsWithData<HomePageQuery>;

const HomePage: PageComponent<HomePageProps> = ({ data: { viewer } }) => {
  invariant(viewer, "Missing viewer");
  const { activities } = viewer;

  // == Routing
  const router = useRouter();

  return (
    <Stack spacing="xl">
      <Stack spacing={8}>
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
        </Stack>
      </Stack>
      <HomePageGoogleEvents
        onCreateActivity={({ url }) => {
          router.visit(url);
        }}
      />
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
