import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Text } from "@mantine/core";

import type { ActivityStoryPageQuery } from "~/helpers/graphql";

export type ActivityStoryPageProps = PagePropsWithData<ActivityStoryPageQuery>;

const ActivityStoryPage: PageComponent<ActivityStoryPageProps> = ({
  data: { activity },
}) => {
  invariant(activity, "Missing activity");
  const { title } = activity;

  // // == Start
  // const startDateTime = useMemo(() => DateTime.fromISO(start), [start]);
  // const startDateLabel = useMemo(() => {
  //   if (startDateTime.hasSame(DateTime.local(), "day")) {
  //     return "Today";
  //   }
  //   return startDateTime.toLocaleString({
  //     month: "short",
  //     day: "numeric",
  //   });
  // }, [startDateTime]);

  // // == Reservation Footer
  // const { entry: footerIntersection, ref: footerRef } =
  //   useIntersection<HTMLDivElement>({
  //     threshold: 0,
  //   });

  return (
    <Box bg="pink.3" p="xl">
      <Text>{title}</Text>
    </Box>
  );
};

export default ActivityStoryPage;
