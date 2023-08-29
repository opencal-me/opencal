import type { FC } from "react";
import type { BoxProps } from "@mantine/core";

import {
  HomePageActivitiesQueryDocument,
  HomePageActivitiesQueryVariables,
} from "~/helpers/graphql";

import { currentTimezone } from "~/helpers/luxon";
import ActivityCard from "./ActivityCard";

export type HomePageActivitiesProps = Omit<BoxProps, "children">;

const HomePageActivities: FC<HomePageActivitiesProps> = ({ ...otherProps }) => {
  // == Query
  const onError = useApolloAlertCallback("Failed to load activities");
  const variables = useMemo<HomePageActivitiesQueryVariables>(
    () => ({
      timezone: currentTimezone(),
    }),
    [],
  );
  const { data } = useQuery(HomePageActivitiesQueryDocument, {
    variables,
    onError,
  });
  const { activities } = data?.viewer ?? {};

  // == Markup
  return (
    <Stack spacing={8} {...otherProps}>
      <Title order={2} size="h3">
        Your Activities
      </Title>
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

export default HomePageActivities;
