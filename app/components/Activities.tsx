import type { ReactNode } from "react";
import type { BoxProps } from "@mantine/core";
import { groupBy } from "lodash-es";

import type { ActivitiesActivityFragment } from "~/helpers/graphql";

export type ActivitiesProps<T extends ActivitiesActivityFragment> = Omit<
  BoxProps,
  "children"
> & {
  readonly activities: ReadonlyArray<T>;
  readonly renderItem: (activity: T) => ReactNode;
  readonly empty?: ReactNode;
};

const Activities = <T extends ActivitiesActivityFragment>({
  activities,
  renderItem,
  empty,
  ...otherProps
}: ActivitiesProps<T>): ReactNode => {
  // == Groupings
  const groupings = useMemo(
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

  // == Markup
  return (
    <Stack spacing="xs" {...otherProps}>
      {!isEmpty(groupings)
        ? Object.entries(groupings).map(([grouping, activities]) => (
            <>
              <Divider
                label={grouping}
                styles={({ colors, fn }) => ({
                  label: {
                    color: colors.dark[fn.primaryShade()],
                    "&::after": {
                      borderColor: colors.gray[3],
                    },
                  },
                })}
              />
              {activities.map(renderItem)}
            </>
          ))
        : empty ?? <EmptyCard itemLabel="activities" />}
    </Stack>
  );
};

export default Activities;
