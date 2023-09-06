import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Avatar, Text } from "@mantine/core";

import type { MobileSubscriberActivitiesPageQuery } from "~/helpers/graphql";

import ActivityCard from "~/components/ActivityCard";

export type MobileSubscriberActivitiesPageProps =
  PagePropsWithData<MobileSubscriberActivitiesPageQuery>;

const MobileSubscriberActivitiesPage: PageComponent<
  MobileSubscriberActivitiesPageProps
> = ({ data: { subscriber } }) => {
  invariant(subscriber, "Missing subscriber");
  const { activities } = subscriber;

  return (
    <Stack spacing="xs">
      <Box>
        <Title order={2} size="h3">
          Upcoming activities
        </Title>
        <Text size="sm" color="dimmed" lh={1.4}>
          What the people you subscribe to are up to.
        </Text>
      </Box>
      <Stack spacing="xs">
        {!isEmpty(activities) ? (
          activities.map(activity => {
            const { id: activityId, owner } = activity;
            return (
              <ActivityCard
                key={activityId}
                href={activity.joinUrl}
                topSection={
                  <Card.Section inheritPadding>
                    <Group spacing={8} py={8}>
                      <Avatar src={owner.avatarUrl} size="xs" radius="xl">
                        {owner.initials}
                      </Avatar>
                      <Text size="sm" color="gray.6">
                        {owner.firstName}&apos;s gonna be at
                      </Text>
                    </Group>
                  </Card.Section>
                }
                {...{ activity }}
              />
            );
          })
        ) : (
          <EmptyCard itemLabel="activities" />
        )}
      </Stack>
    </Stack>
  );
};

MobileSubscriberActivitiesPage.layout =
  buildLayout<MobileSubscriberActivitiesPageProps>(
    (page, { data: { viewer } }) => {
      return (
        <AppLayout
          title="Upcoming activities"
          noIndex
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

export default MobileSubscriberActivitiesPage;
