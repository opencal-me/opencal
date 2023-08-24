import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Loader, Text } from "@mantine/core";

import { UserLoginPageQuery } from "~/helpers/graphql";

import FormAuthenticityField from "~/components/FormAuthenticityField";

export type UserLoginPageProps = PagePropsWithData<UserLoginPageQuery> & {
  readonly authorizeAction: string;
};

const UserLoginPage: PageComponent<UserLoginPageProps> = ({
  authorizeAction,
}) => {
  const mounted = useMounted();

  // == Autosubmit
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (formRef.current && mounted) {
      formRef.current.requestSubmit();
    }
  }, [mounted]);

  return (
    <Card w={340} withBorder>
      <Stack align="center" spacing={8} py="md">
        <Loader size="sm" />
        <Text size="sm" color="dark.4">
          Signing in with Google...
        </Text>
      </Stack>
      <form ref={formRef} action={authorizeAction} method="post">
        <FormAuthenticityField />
      </form>
    </Card>
  );
};

UserLoginPage.layout = buildLayout<UserLoginPageProps>(
  (page, { data: { viewer } }) => (
    <AppLayout title="Sign In" {...{ viewer }}>
      <Center sx={{ flexGrow: 1 }}>{page}</Center>
    </AppLayout>
  ),
);

export default UserLoginPage;
