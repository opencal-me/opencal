import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";

import type { HomePageQuery } from "~/helpers/graphql";

import GoogleEvents from "~/components/GoogleEvents";

export type HomePageProps = PagePropsWithData<HomePageQuery>;

const HomePage: PageComponent<HomePageProps> = ({ data: { viewer } }) => {
  invariant(viewer, "Missing viewer");
  const { activities } = viewer;

  const router = useRouter();

  return (
    <Stack spacing="xl">
      {!isEmpty(activities) && (
        <Stack spacing={8}>
          <Title order={2} size="h3">
            Your Activities
          </Title>
          <List listStyleType="none">
            {activities.map(({ id, title, url }) => (
              <List.Item key={id}>
                <Anchor component={Link} href={url}>
                  {title}
                </Anchor>
              </List.Item>
            ))}
          </List>
        </Stack>
      )}
      <GoogleEvents
        onCreateActivity={({ url }) => {
          router.visit(url);
        }}
      />
    </Stack>
  );
};

HomePage.layout = buildLayout<HomePageProps>((page, { data: { viewer } }) => (
  <AppLayout withContainer containerSize="xs" withGutter {...{ viewer }}>
    {page}
  </AppLayout>
));

export default HomePage;
