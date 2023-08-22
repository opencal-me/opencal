import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Global, Image, Text } from "@mantine/core";

import type { ActivityStoryPageQuery } from "~/helpers/graphql";

export type ActivityStoryPageProps = PagePropsWithData<ActivityStoryPageQuery>;

import PageLayout from "~/components/PageLayout";
import logoSrc from "~/assets/images/logo-with-text.png";

const SCALE_FACTOR = 2.5;

const ActivityStoryPage: PageComponent<ActivityStoryPageProps> = ({
  data: { activity },
}) => {
  invariant(activity, "Missing activity");
  const { name, start } = activity;

  // == Start
  const startDateTime = useMemo(() => DateTime.fromISO(start), [start]);
  const startDateLabel = useMemo(() => {
    if (startDateTime.hasSame(DateTime.local(), "day")) {
      return "Today";
    }
    return startDateTime.toLocaleString({
      month: "short",
      day: "numeric",
    });
  }, [startDateTime]);

  return (
    <Stack
      align="center"
      w={1080 / SCALE_FACTOR}
      h={1920 / SCALE_FACTOR}
      p={40}
      bg="#F7FDFF"
    >
      <Space h="xl" />
      <Stack align="center" spacing={8}>
        <Text size="xl" color="dark.4" weight={600}>
          come join me at
        </Text>
        <Title align="center" lh={1.3}>
          {name}
        </Title>
        <Badge
          variant="outline"
          color="brand"
          size="xl"
          mt="md"
          sx={{ borderWidth: 2 }}
        >
          {startDateLabel} at{" "}
          <Time format={{ hour: "numeric", minute: "numeric" }}>
            {startDateTime}
          </Time>
        </Badge>
      </Stack>
      <Space sx={{ flexGrow: 1 }} />
      <Image src={logoSrc} width={rem(180)} />
    </Stack>
  );
};

ActivityStoryPage.layout = page => (
  <PageLayout>
    <Head>
      <meta name="robots" content="noindex" />
    </Head>
    <Global
      styles={{
        body: {
          zoom: `${SCALE_FACTOR * 100}%`,
        },
      }}
    />
    {page}
  </PageLayout>
);

export default ActivityStoryPage;
