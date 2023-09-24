import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Code, CopyButton, Text } from "@mantine/core";
import SignInIcon from "~icons/heroicons/arrow-right-on-rectangle-20-solid";

import type { GroupPageQuery } from "~/helpers/graphql";

import GroupDeleteButton from "~/components/GroupDeleteButton";
import GroupEditButton from "~/components/GroupEditButton";
import UserLoginForm from "~/components/UserLoginForm";
import GroupJoinButton from "~/components/GroupJoinButton";
import Activities from "~/components/Activities";
import ActivityCard from "~/components/ActivityCard";

export type GroupPageProps = PagePropsWithData<GroupPageQuery>;

const GroupPage: PageComponent<GroupPageProps> = ({
  data: { viewer, group },
}) => {
  invariant(group, "Missing group");
  const {
    id: groupId,
    name,
    handle,
    memberships,
    activities,
    url,
    isJoinedByViewer,
    isManagedByViewer,
  } = group;

  // == Routing
  const router = useRouter();

  return (
    <Stack spacing={32}>
      {isManagedByViewer && (
        <Alert
          title="This is your group page"
          variant="filled"
          styles={({ fontSizes }) => ({
            title: {
              fontSize: fontSizes.md,
              marginBottom: rem(4),
              lineHeight: 1.3,
            },
          })}
        >
          <Stack spacing="xs">
            <Text lh={1.3}>
              Share this page with the people you&apos;d like to invite to your
              group.
            </Text>
            <Box>
              <CopyButton value={url}>
                {({ copy, copied }) => (
                  <Button
                    variant="light"
                    leftIcon={<ClipboardIcon />}
                    onClick={copy}
                  >
                    {copied ? "Link copied!" : "Copy link"}
                  </Button>
                )}
              </CopyButton>
            </Box>
          </Stack>
        </Alert>
      )}
      <Stack spacing="xl">
        <Card withBorder>
          <Stack spacing={8}>
            <Box>
              <Text weight={700}>{name}</Text>
              <Text size="sm" color="gray.7">
                Share activities to your group with{" "}
                <Code>[open @{handle}]</Code>.
              </Text>
            </Box>
            {viewer ? (
              isManagedByViewer ? (
                <Group spacing={8}>
                  <GroupEditButton
                    onUpdate={() => {
                      router.reload({ preserveScroll: true });
                    }}
                    {...{ groupId }}
                  />
                  <GroupDeleteButton
                    onDelete={() => {
                      router.visit("/home");
                    }}
                    {...{ groupId }}
                  />
                </Group>
              ) : !isJoinedByViewer ? (
                <Box>
                  <GroupJoinButton
                    onJoin={() => {
                      router.reload({ preserveScroll: true });
                    }}
                    {...{ groupId }}
                  />
                </Box>
              ) : null
            ) : (
              <UserLoginForm>
                <Button type="submit" leftIcon={<SignInIcon />}>
                  Sign in to join this group
                </Button>
              </UserLoginForm>
            )}
          </Stack>
        </Card>
        <Stack spacing="xs">
          <Title order={2} size="h3" lh={1.3}>
            Upcoming activities
          </Title>
          <Activities
            renderItem={activity => {
              const { id: activityId, joinUrl } = activity;
              return (
                <ActivityCard
                  key={activityId}
                  href={joinUrl}
                  {...{ activity }}
                />
              );
            }}
            {...{ activities }}
          />
        </Stack>
        <Stack spacing="xs">
          <Title order={2} size="h3" lh={1.3}>
            Group members
          </Title>
          {memberships.map(({ id: membershipId, isAdmin, member }) => (
            <Card key={membershipId} withBorder>
              <Group spacing="xs">
                <Text sx={{ flexGrow: 1 }}>{member.name}</Text>
                {isAdmin && <Badge radius="xl">Admin</Badge>}
              </Group>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

GroupPage.layout = buildLayout<GroupPageProps>(
  (page, { data: { viewer, group } }) => {
    invariant(group, "Missing group");
    return (
      <AppLayout
        title={[group.name]}
        noIndex
        breadcrumbs={[
          { title: "Home", href: "/home" },
          { title: group.name, href: group.url },
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

export default GroupPage;
