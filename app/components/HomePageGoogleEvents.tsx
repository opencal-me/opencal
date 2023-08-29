import type { FC } from "react";
import type { BoxProps } from "@mantine/core";

import { HomePageGoogleEventsQueryDocument } from "~/helpers/graphql";

import GoogleEventCard from "./GoogleEventCard";
import type { GoogleEventCardProps } from "./GoogleEventCard";

export type HomePageGoogleEventsProps = Omit<BoxProps, "children"> &
  Pick<GoogleEventCardProps, "onCreateActivity">;

const HomePageGoogleEvents: FC<HomePageGoogleEventsProps> = ({
  onCreateActivity,
  ...otherProps
}) => {
  // == Search
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 200);

  // == Query
  const onError = useApolloAlertCallback("Failed to load events");
  const { data } = useQuery(HomePageGoogleEventsQueryDocument, {
    variables: {
      query: debouncedSearch,
    },
    onError,
  });
  const { googleEvents: events } = data?.viewer ?? {};

  // == Markup
  return (
    <Stack spacing={8} {...otherProps}>
      <Title order={2} size="h3">
        Your Events
      </Title>
      <Stack spacing="xs">
        <TextInput
          size="md"
          variant="filled"
          placeholder="Search events..."
          value={search}
          onChange={({ target }) => setSearch(target.value)}
        />
        {events ? (
          !isEmpty(events) ? (
            events.map(event => (
              <GoogleEventCard
                key={event.id}
                {...{ event, onCreateActivity }}
              />
            ))
          ) : (
            <EmptyCard itemLabel="events" />
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

export default HomePageGoogleEvents;
