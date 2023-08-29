import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Text } from "@mantine/core";

import { UserLoginPageQuery } from "~/helpers/graphql";

import UserLoginForm from "~/components/UserLoginForm";

export type UserLoginPageProps = PagePropsWithData<UserLoginPageQuery> & {
  readonly authorizeAction: string;
};

const UserLoginPage: PageComponent<UserLoginPageProps> = ({
  authorizeAction,
}) => {
  return (
    <Card w={380} withBorder>
      <Stack>
        <Stack align="center" spacing={2}>
          <Title size="h3">Re-authorization Required</Title>
          <Text size="sm" color="dimmed" lh={1.3}>
            <Anchor component={Link} href="/" color="brand" weight={600}>
              OpenCal
            </Anchor>{" "}
            needs you to re-authenticate with Google to connect with your
            calendar.
          </Text>
        </Stack>
        <UserLoginForm action={authorizeAction}>
          <Button type="submit" fullWidth>
            Continue to Google
          </Button>
        </UserLoginForm>
      </Stack>
    </Card>
  );
};

UserLoginPage.layout = buildLayout<UserLoginPageProps>(
  (page, { data: { viewer } }) => (
    <AppLayout title="Re-authorization Required" {...{ viewer }}>
      <Center sx={{ flexGrow: 1 }}>{page}</Center>
    </AppLayout>
  ),
);

export default UserLoginPage;
