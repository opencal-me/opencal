import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { currentTimezone } from "~/helpers/luxon";

import { UserPageActivitiesQueryDocument } from "~/helpers/graphql";
import type {
  UserPageActivitiesQueryVariables,
  UserPageQuery,
} from "~/helpers/graphql";

import ActivityCard from "~/components/ActivityCard";
import { Avatar, Text } from "@mantine/core";

export type UserPageProps = PagePropsWithData<UserPageQuery>;

const UserPage: PageComponent<UserPageProps> = ({ data: { viewer, user } }) => {
  invariant(viewer, "Missing viewer");
  invariant(user, "Missing user");
  const { id: userId, firstName, avatarUrl, initials } = user;

  // == Activities Query
  const onActivitiesError = useApolloAlertCallback("Failed to load activities");
  const variables = useMemo<UserPageActivitiesQueryVariables>(
    () => ({
      userId,
      timezone: currentTimezone(),
    }),
    [userId],
  );
  const { data } = useQuery(UserPageActivitiesQueryDocument, {
    variables,
    onError: onActivitiesError,
  });
  const { activities } = data?.user ?? {};

  return (
    <Stack spacing="xl">
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
          <Title order={1} size="h3">
            {firstName}&apos;s activities
          </Title>
          <Text size="sm" color="dimmed">
            Join an activity, and get involved with {firstName}&apos;s life :)
          </Text>
        </Box>
      </Stack>
      <Stack spacing="xs">
        {activities ? (
          !isEmpty(activities) ? (
            activities.map(activity => (
              <ActivityCard key={activity.id} {...{ activity }} />
            ))
          ) : (
            <EmptyCard itemLabel="activities" />
          )
        ) : (
          [...new Array(3)].map((value, index) => (
            <Skeleton key={index} radius="md" h={64} />
          ))
        )}
      </Stack>
    </Stack>
  );
};

UserPage.layout = buildLayout<UserPageProps>(
  (page, { data: { viewer, user } }) => {
    invariant(user, "Missing user");
    return (
      <AppLayout
        title={`${user.firstName}'s activities`}
        noIndex
        breadcrumbs={[
          ...(user.isViewer ? [{ title: "Home", href: "/home" }] : []),
          { title: `${user.firstName}'s activities`, href: user.url },
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
