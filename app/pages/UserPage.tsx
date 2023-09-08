import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Avatar, CopyButton, Text } from "@mantine/core";

import type { UserPageQuery } from "~/helpers/graphql";

import ActivityCard from "~/components/ActivityCard";
import UserBio from "~/components/UserBio";
import UserMobileSubscribeForm from "~/components/MobileSubscriptionForm";
import { groupBy } from "lodash-es";

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

  // == Activity Groupings
  const activityGroupings = useMemo(
    () =>
      groupBy(activities, ({ start }) => {
        const today = DateTime.now();
        const dayAfterTomorrow = today
          .plus({ days: 2 })
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const nextWeek = today
          .plus({ weeks: 1 })
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        const startDateTime = DateTime.fromISO(start);
        if (startDateTime < dayAfterTomorrow) {
          return "Today and tomorrow";
        }
        if (startDateTime < nextWeek) {
          return "This week";
        }
        return "Later";
      }),
    [activities],
  );

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
          {!isEmpty(activityGroupings) ? (
            Object.entries(activityGroupings).map(([grouping, activities]) => (
              <>
                <Divider
                  label={grouping}
                  color="gray"
                  styles={({ colors }) => ({
                    label: {
                      "&::after": {
                        borderColor: colors.gray[3],
                      },
                    },
                  })}
                />
                {activities.map(activity => {
                  const { id: activityId, joinUrl } = activity;
                  return (
                    <ActivityCard
                      key={activityId}
                      href={joinUrl}
                      {...{ activity }}
                    />
                  );
                })}
              </>
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
