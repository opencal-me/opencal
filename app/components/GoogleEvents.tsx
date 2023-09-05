import type { FC } from "react";
import type { BoxProps } from "@mantine/core";

import { GoogleEventsQueryDocument } from "~/helpers/graphql";

import GoogleEventCard from "./GoogleEventCard";
import type { GoogleEventCardProps } from "./GoogleEventCard";

export type GoogleEventsProps = Omit<BoxProps, "children"> &
  Pick<GoogleEventCardProps, "onConvert">;

const GoogleEvents: FC<GoogleEventsProps> = ({ onConvert, ...otherProps }) => {
  // == Search
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 200);

  // == Query
  const onError = useApolloAlertCallback("Failed to load events");
  const { data } = useQuery(GoogleEventsQueryDocument, {
    variables: {
      query: debouncedSearch,
    },
    onError,
  });
  const { googleEvents: events } = data?.viewer ?? {};

  // == Markup
  return (
    <Stack spacing="xs" {...otherProps}>
      <TextInput
        placeholder="Search calendar events..."
        size="md"
        variant="filled"
        value={search}
        onChange={({ target }) => setSearch(target.value)}
      />
      {events ? (
        !isEmpty(events) ? (
          events.map(event => (
            <GoogleEventCard key={event.id} {...{ event, onConvert }} />
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
  );
};

export default GoogleEvents;
