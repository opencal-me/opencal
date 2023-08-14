import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Text } from "@mantine/core";

import type { LandingPageQuery } from "~/helpers/graphql";

import ContactMeLink from "~/components/ContactMeLink";

export type LandingPageProps = PagePropsWithData<LandingPageQuery>;

const LandingPage: PageComponent<LandingPageProps> = () => (
  <Stack align="center" spacing={8}>
    <Text>this be a landing page</Text>
    <ContactMeLink subject="hey guys!">yo wanna link up</ContactMeLink>
    <Anchor component={Link} href="/home">
      take me home, country road
    </Anchor>
  </Stack>
);

LandingPage.layout = buildLayout<LandingPageProps>(
  (page, { data: { viewer } }) => (
    <AppLayout withContainer withGutter {...{ viewer }}>
      {page}
    </AppLayout>
  ),
);

export default LandingPage;
