import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Footer, Image, Text } from "@mantine/core";
import demoSrc from "~/assets/images/demo.gif";

import type { LandingPageQuery } from "~/helpers/graphql";

import ContactMeLink from "~/components/ContactMeLink";
import UserLoginForm from "~/components/UserLoginForm";
import PageContainer from "~/components/PageContainer";

export type LandingPageProps = PagePropsWithData<LandingPageQuery>;

const LandingPage: PageComponent<LandingPageProps> = ({ data: { viewer } }) => (
  <>
    {viewer && (
      <Container size="sm" w="100%" py="xl">
        <Alert
          color="indigo"
          sx={({ colors }) => ({
            border: `${rem(1)} solid ${colors.indigo[1]}`,
          })}
        >
          <Group position="apart">
            <Text color="dark.7" weight={500}>
              Welcome back, {viewer.firstName} :)
            </Text>
            <Button
              component={Link}
              href="/home"
              radius="md"
              variant="gradient"
              gradient={{ from: "brand", to: "indigo" }}
            >
              Go to your events and activities
            </Button>
          </Group>
        </Alert>
      </Container>
    )}
    <PageContainer size="xs" withGutter>
      <Stack spacing={44} pt={44} pb="lg">
        <Stack align="center" spacing="xl">
          <Title align="center" fz={44} lh={1.2} sx={{ letterSpacing: -1.2 }}>
            Invite your friends to your everyday activities
          </Title>
          <Text align="center" size="lg" color="gray.7" lh={1.3} maw={480}>
            Add [open] to the title of an event in your calendar, to sync it to
            your opencal page. share your page with friends, so they can join
            you when they&apos;re free.
          </Text>
        </Stack>
        <Image src={demoSrc} alt="demo" />
        {!viewer && (
          <Stack align="center" spacing="sm">
            <Text color="dark" lh={1.3}>
              Ready to get started?
            </Text>
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
            <Text size="xs" color="dimmed" align="center" maw={400}>
              OpenCal&apos;s use and transfer to any other app of information
              received from Google APIs will adhere to{" "}
              <Anchor
                href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Google API Services User Data Policy
              </Anchor>
              , including the Limited Use requirements.
            </Text>
          </Stack>
        )}
      </Stack>
    </PageContainer>
  </>
);

LandingPage.layout = buildLayout<LandingPageProps>(
  (page, { data: { viewer } }) => (
    <AppLayout
      padding={0}
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
