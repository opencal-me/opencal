import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Avatar, CopyButton, Text } from "@mantine/core";

import type { UserPageQuery } from "~/helpers/graphql";

import ActivityCard from "~/components/ActivityCard";
import UserBio from "~/components/UserBio";
import UserMobileSubscribeForm from "~/components/MobileSubscriptionForm";

export type UserPageProps = PagePropsWithData<UserPageQuery>;

const UserPage: PageComponent<UserPageProps> = ({ data: { user, viewer } }) => {
  invariant(user, "Missing user");
  const {
    id: userId,
    firstName,
    avatarUrl,
    initials,
    bio,
    activities,
    url,
    isViewer,
  } = user;

  return (
    <Stack spacing={32}>
      {isViewer && (
        <Alert
          title="This is your public profile"
          variant="filled"
          styles={({ fontSizes }) => ({
            title: {
              fontSize: fontSizes.md,
              marginBottom: rem(4),
              lineHeight: 1.3,
            },
          })}
        >
          <Stack spacing="xs">
            <Text lh={1.3}>
              Share this page with the people you want to hang out with more :)
            </Text>
            <Box>
              <CopyButton value={url}>
                {({ copy, copied }) => (
                  <Button
                    variant="light"
                    leftIcon={<ClipboardIcon />}
                    onClick={copy}
                  >
                    {copied ? "Profile link copied!" : "Copy profile link"}
                  </Button>
                )}
              </CopyButton>
            </Box>
          </Stack>
        </Alert>
      )}
      <Stack spacing="xl">
        <Stack>
          <Stack align="center" spacing={8}>
            {!!avatarUrl && (
              <Avatar
                src={avatarUrl}
                color="brand"
                radius="100%"
                size="md"
                sx={{ alignSelf: "center" }}
              >
                {initials}
              </Avatar>
            )}
            <Box sx={{ textAlign: "center" }}>
              <Title order={1} size="h2">
                {firstName}&apos;s OpenCal
              </Title>
            </Box>
          </Stack>
          {(bio || isViewer) && <UserBio editable={isViewer} {...{ user }} />}
          <Card withBorder bg="gray.0">
            <Stack spacing={4}>
              <Text size="sm" color="gray.7" weight={500}>
                Get notified when {firstName} is up to something!
              </Text>
              <UserMobileSubscribeForm subjectId={userId} {...{ viewer }} />
            </Stack>
          </Card>
        </Stack>
        <Stack spacing="xs">
          <Box>
            <Title order={2} size="h3">
              Upcoming activities
            </Title>
            <Text size="sm" color="dimmed">
              Join an activity, and get involved with {firstName}&apos;s life :)
            </Text>
          </Box>
          {!isEmpty(activities) ? (
            activities.map(activity => (
              <ActivityCard
                key={activity.id}
                href={activity.joinUrl}
                {...{ activity }}
              />
            ))
          ) : (
            <EmptyCard itemLabel="activities" />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

UserPage.layout = buildLayout<UserPageProps>(
  (page, { data: { viewer, user } }) => {
    invariant(user, "Missing user");
    return (
      <AppLayout
        title={`${user.firstName}'s OpenCal`}
        noIndex
        breadcrumbs={[
          ...(user.isViewer ? [{ title: "Home", href: "/home" }] : []),
          { title: `${user.firstName}'s OpenCal`, href: user.url },
        ]}
        withContainer
        containerSize="xs"
        withGutter
        {...{ viewer }}
      >
        {page}
      </AppLayout>
    );
  },
);

export default UserPage;
