import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Text } from "@mantine/core";

import type { HomePageQuery } from "~/helpers/graphql";
import ContactMeLink from "~/components/ContactMeLink";

export type HomePageProps = PagePropsWithData<HomePageQuery>;

const HomePage: PageComponent<HomePageProps> = () => (
  <Stack align="center" spacing={8}>
    <Text>Aaaand we&apos;re live!</Text>
    <ContactMeLink>hey hey hey</ContactMeLink>
  </Stack>
);

HomePage.layout = buildLayout<HomePageProps>((page, { data: { viewer } }) => (
  <AppLayout withContainer withGutter {...{ viewer }}>
    {page}
  </AppLayout>
));

export default HomePage;
