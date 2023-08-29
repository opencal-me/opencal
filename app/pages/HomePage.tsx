import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";

import type { HomePageQuery } from "~/helpers/graphql";

import HomePageGoogleEvents from "~/components/HomePageGoogleEvents";
import HomePageActivities from "~/components/HomePageActivities";

export type HomePageProps = PagePropsWithData<HomePageQuery>;

const HomePage: PageComponent<HomePageProps> = ({ data: { viewer } }) => {
  invariant(viewer, "Missing viewer");
  const router = useRouter();

  return (
    <Stack spacing="xl">
      <HomePageActivities />
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
