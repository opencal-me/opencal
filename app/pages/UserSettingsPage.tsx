import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";

import type { UserSettingsPageQuery } from "~/helpers/graphql";
import { Avatar } from "@mantine/core";

// import UserSettingsPageForm from "~/components/UserSettingsPageForm";

export type UserSettingsPageProps = PagePropsWithData<UserSettingsPageQuery>;

const UserSettingsPage: PageComponent<UserSettingsPageProps> = ({
  data: { viewer },
}) => {
  invariant(viewer, "Missing viewer");
  const { avatarUrl, firstName, lastName, name, email } = viewer;

  // == Markup
  return (
    <Stack>
      <Card radius="md" withBorder>
        <Stack spacing="xs">
          <Stack align="center" spacing={8}>
            {!!avatarUrl && (
              <Avatar
                src={avatarUrl}
                radius="100%"
                size="md"
                sx={{ alignSelf: "center" }}
              >
                {name}
              </Avatar>
            )}
            <Title order={2} size="h4" lh={1}>
              Your Profile
            </Title>
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
    <AppLayout withContainer withGutter containerSize={440} {...{ viewer }}>
      {page}
    </AppLayout>
  ),
);

export default UserSettingsPage;
