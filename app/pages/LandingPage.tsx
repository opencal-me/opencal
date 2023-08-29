import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Footer, Text } from "@mantine/core";
import { Tweet } from "react-tweet";

import type { LandingPageQuery } from "~/helpers/graphql";

import ContactMeLink from "~/components/ContactMeLink";
import UserLoginForm from "~/components/UserLoginForm";

export type LandingPageProps = PagePropsWithData<LandingPageQuery>;

const LandingPage: PageComponent<LandingPageProps> = ({ data: { viewer } }) => {
  const mounted = useMounted();

  return (
    <Stack spacing="xl">
      <Text lh={1.3}>
        Hi! This is{" "}
        <Text span weight={600}>
          OpenCal
        </Text>
        , a lowkey way to share what you&apos;ll be up to with your friends, and
        let them join you on your life&apos;s adventures.
      </Text>
      <Card withBorder radius={12} py="lg">
        <Stack align="center" spacing={8}>
          <Text color="dark" lh={1.3}>
            {viewer ? (
              <>
                Welcome back,{" "}
                <Text span weight={600}>
                  {viewer.firstName}!
                </Text>
              </>
            ) : (
              <>Ready to get started?</>
            )}
          </Text>
          {viewer ? (
            <Button
              component={Link}
              href="/home"
              size="lg"
              radius="md"
              variant="gradient"
              gradient={{ from: "brand", to: "indigo" }}
            >
              Go to your events and activities
            </Button>
          ) : (
            <UserLoginForm>
              <Button
                type="submit"
                size="lg"
                radius="md"
                variant="gradient"
                gradient={{ from: "brand", to: "indigo" }}
              >
                Sign in with Google to continue
              </Button>
            </UserLoginForm>
          )}
        </Stack>
      </Card>
      <Stack spacing={8}>
        <Text lh={1.3}>Curious to know how it works? Check out this reel:</Text>
        {mounted && (
          <Box
            data-theme="light"
            sx={{
              "> .react-tweet-theme": {
                margin: 0,
              },
            }}
          >
            <Tweet id="1693789569764761933" />
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

LandingPage.layout = buildLayout<LandingPageProps>(
  (page, { data: { viewer } }) => (
    <AppLayout
      withContainer
      containerSize="xs"
      withGutter
      footer={
        <Footer height={80}>
          <Stack align="center" justify="center" spacing={0} h="100%">
            <ContactMeLink size="sm" subject="hey!">
              Got questions? Shoot us an email :)
            </ContactMeLink>
            <Anchor href="/privacy" size="sm">
              See our privacy policy
            </Anchor>
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
