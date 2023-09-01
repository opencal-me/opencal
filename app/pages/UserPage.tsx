import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Avatar, Text } from "@mantine/core";

import type { UserPageQuery } from "~/helpers/graphql";

import ActivityCard from "~/components/ActivityCard";
import UserBio from "~/components/UserBio";
import MobileSubscribeForm from "~/components/MobileSubscribeForm";

export type UserPageProps = PagePropsWithData<UserPageQuery>;

const UserPage: PageComponent<UserPageProps> = ({ data: { user } }) => {
  invariant(user, "Missing user");
  const {
    id: userId,
    firstName,
    avatarUrl,
    initials,
    bio,
    activities,
    canEdit,
  } = user;

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
      {(bio || canEdit) && <UserBio editable={canEdit} {...{ user }} />}
      <Stack spacing="xs">
        {!isEmpty(activities) ? (
          activities.map(activity => (
            <ActivityCard key={activity.id} {...{ activity }} />
          ))
        ) : (
          <EmptyCard itemLabel="activities" />
        )}
      </Stack>
      {!canEdit && (
        <>
          <Divider />
          <Stack spacing={4}>
            <Text size="sm" color="gray.7">
              Get notified when {firstName} is up to something!
            </Text>
            <MobileSubscribeForm subjectId={userId} />
          </Stack>
        </>
      )}
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
