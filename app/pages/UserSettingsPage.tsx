import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Avatar, Text } from "@mantine/core";

import type { UserSettingsPageQuery } from "~/helpers/graphql";

// import UserSettingsPageForm from "~/components/UserSettingsPageForm";

export type UserSettingsPageProps = PagePropsWithData<UserSettingsPageQuery>;

const UserSettingsPage: PageComponent<UserSettingsPageProps> = ({
  data: { viewer },
}) => {
  invariant(viewer, "Missing viewer");
  const { avatarUrl, firstName, lastName, initials, email } = viewer;

  // == Markup
  return (
    <Stack>
      <Card withBorder>
        <Stack spacing={8}>
          <Stack align="center" spacing={4}>
            {!!avatarUrl && (
              <Avatar
                src={avatarUrl}
                color="brand"
                radius="100%"
                size="md"
                sx={{ alignSelf: "center" }}
              >
                {initials}
              </Avatar>
            )}
            <Text color="dark" weight={500} size="sm">
              {firstName}
            </Text>
          </Stack>
          <TextInput label="Email" value={email} readOnly />
          <TextInput label="First Name" value={firstName} readOnly />
          {!!lastName && (
            <TextInput label="Last Name" value={lastName} readOnly />
          )}
        </Stack>
      </Card>
    </Stack>
  );
};

UserSettingsPage.layout = buildLayout<UserSettingsPageProps>(
  (page, { data: { viewer } }) => (
    <AppLayout
      title="Settings"
      breadcrumbs={[
        { title: "Home", href: "/" },
        { title: "Settings", href: "/user/settings" },
      ]}
      withContainer
      withGutter
      containerSize={440}
      {...{ viewer }}
    >
      {page}
    </AppLayout>
  ),
);

export default UserSettingsPage;
