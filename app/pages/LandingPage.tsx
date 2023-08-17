import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Text } from "@mantine/core";

import type { LandingPageQuery } from "~/helpers/graphql";

// import ContactMeLink from "~/components/ContactMeLink";

export type LandingPageProps = PagePropsWithData<LandingPageQuery>;

const LandingPage: PageComponent<LandingPageProps> = ({ data: { viewer } }) => (
  <Stack spacing={8}>
    {viewer && (
      <Anchor component={Link} href="/home">
        i&apos;m logged in! take me to my events & activities :)
      </Anchor>
    )}
    <Text>this be a landing page. someone needs to add some content here!</Text>
    {/* <ContactMeLink subject="hey guys!">yo wanna link up</ContactMeLink> */}
  </Stack>
);

LandingPage.layout = buildLayout<LandingPageProps>(
  (page, { data: { viewer } }) => (
    <AppLayout withContainer containerSize="xs" withGutter {...{ viewer }}>
      {page}
    </AppLayout>
  ),
);

export default LandingPage;
