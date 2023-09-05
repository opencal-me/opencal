import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { CopyButton, Image, Text } from "@mantine/core";
import ClipboardIcon from "~icons/heroicons/clipboard-20-solid";

import type { ActivitySharePageQuery } from "~/helpers/graphql";

export type ActivitySharePageProps = PagePropsWithData<ActivitySharePageQuery>;

const ActivitySharePage: PageComponent<ActivitySharePageProps> = ({
  data: { activity },
}) => {
  invariant(activity, "Missing activity");
  const { joinUrl, storyImageUrl } = activity;

  return (
    <Stack spacing="lg">
      <Stack spacing={4}>
        <Title size="h3" lh={1.2}>
          Share to your Instagram story
        </Title>
        <Text color="dimmed" size="sm">
          Please do this on your phone.
        </Text>
      </Stack>
      <Stack spacing={8}>
        <Text lh={1.3}>
          <Text span weight={600}>
            Step 1:
          </Text>{" "}
          Copy the join link for this activity.
        </Text>
        <Box>
          <CopyButton value={joinUrl}>
            {({ copy, copied }) => (
              <Button leftIcon={<ClipboardIcon />} onClick={copy}>
                {copied ? "Link copied!" : "Copy link"}
              </Button>
            )}
          </CopyButton>
        </Box>
      </Stack>
      <Stack spacing={8}>
        <Text lh={1.3}>
          <Text span weight={600}>
            Step 2:
          </Text>{" "}
          Long-press this image, and save it to your camera roll.
        </Text>
        <Box
          pos="relative"
          w={240}
          h={425}
          sx={({ radius, colors }) => ({
            border: `${rem(1)} solid ${colors.gray[3]}`,
            borderRadius: radius.md,
            overflow: "hidden",
          })}
        >
          <Image src={storyImageUrl} />
          <Skeleton pos="absolute" inset={0} sx={{ zIndex: -1 }} />
        </Box>
      </Stack>
      <Box>
        <Text weight={600}>Step 3:</Text>
        <Stack spacing={6}>
          <Text lh={1.3}>
            Press the button to add to your story on Instagram, and select the
            image you just saved.
          </Text>
          <Text lh={1.3}>Swipe up, and tap the button to add a link.</Text>
          <Text lh={1.3}>Paste the link you copied in step 1.</Text>
        </Stack>
      </Box>
    </Stack>
  );
};

ActivitySharePage.layout = buildLayout<ActivitySharePageProps>(
  (page, { data: { viewer, activity } }) => {
    invariant(activity, "Missing activity");
    return (
      <AppLayout
        title={[activity.name, "Share"]}
        noIndex
        breadcrumbs={[
          { title: "Home", href: "/home" },
          { title: activity.name, href: activity.url },
          { title: "Share to Instagram", href: activity.shareUrl },
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

export default ActivitySharePage;
