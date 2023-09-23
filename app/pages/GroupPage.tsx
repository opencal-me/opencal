import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Code, Text } from "@mantine/core";

import type { GroupPageQuery } from "~/helpers/graphql";
import GroupDeleteButton from "~/components/GroupDeleteButton";
import GroupEditButton from "~/components/GroupEditButton";

export type GroupPageProps = PagePropsWithData<GroupPageQuery>;

const GroupPage: PageComponent<GroupPageProps> = ({ data: { group } }) => {
  invariant(group, "Missing group");
  const { id: groupId, name, handle, memberships } = group;

  // == Routing
  const router = useRouter();

  return (
    <Stack spacing="lg">
      <Card withBorder>
        <Stack spacing={8}>
          <Box>
            <Text weight={700}>{name}</Text>
            <Text size="sm" color="gray.7">
              Share activities to your group with <Code>[open @{handle}]</Code>.
            </Text>
          </Box>
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
        </Stack>
      </Card>
      <Stack spacing={8}>
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
