import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Footer, Text } from "@mantine/core";
import { TwitterVideoEmbed } from "react-twitter-embed";

import type { LandingPageQuery } from "~/helpers/graphql";

import ContactMeLink from "~/components/ContactMeLink";
import FormAuthenticityField from "~/components/FormAuthenticityField";

// import ContactMeLink from "~/components/ContactMeLink";

export type LandingPageProps = PagePropsWithData<LandingPageQuery>;

const LandingPage: PageComponent<LandingPageProps> = ({ data: { viewer } }) => (
  <Stack spacing="xl">
    {viewer && (
      <Anchor component={Link} href="/home">
        I&apos;m logged in! Take me to my events & activities :)
      </Anchor>
    )}
    <Stack spacing={8}>
      <Text lh={1.4}>
        Hi! This is{" "}
        <Text span weight={500}>
          OpenCal
        </Text>
        , a lowkey way to share what you&apos;ll be up to with your friends, and
        let them join you on your life&apos;s adventures.
      </Text>
      <Text lh={1.4}> Still not sure what I mean? Check out this reel:</Text>
      <TwitterVideoEmbed id="1693789569764761933" />
      {!viewer && (
        <form action="/user/auth/google" method="post">
          <FormAuthenticityField />
          <Button type="submit" size="lg" fullWidth radius="xl">
            Sign in with Google to get started.
          </Button>
        </form>
      )}
    </Stack>
  </Stack>
);

LandingPage.layout = buildLayout<LandingPageProps>(
  (page, { data: { viewer } }) => (
    <AppLayout
      withContainer
      containerSize="xs"
      withGutter
      footer={
        <Footer height={80}>
          <Stack align="center" justify="center" spacing={0} h="100%">
            <ContactMeLink subject="hey!">
              Got questions? Shoot us an email :)
            </ContactMeLink>
            <Anchor href="/privacy">See our privacy policy.</Anchor>
          </Stack>
        </Footer>
      }
      {...{ viewer }}
    >
      {page}
    </AppLayout>
  ),
);

export default LandingPage;
