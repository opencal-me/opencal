import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Text } from "@react-email/components";

import EmailLayout from "~/components/EmailLayout";

import type { UserWelcomeEmailQuery } from "~/helpers/graphql";

export type UserWelcomeEmailProps = PagePropsWithData<UserWelcomeEmailQuery>;

const UserWelcomeEmail: PageComponent<UserWelcomeEmailProps> = ({
  data: { user },
}) => {
  invariant(user, "Missing user");
  const { firstName } = user;
  return (
    <>
      <Text>Hi, {firstName}!</Text>
      <Text>
        Thanks for registering for an account on my website.
        <br />
        I&apos;ll keep you posted when there&apos;s more stuff you can do on
        here :)
      </Text>
    </>
  );
};

UserWelcomeEmail.layout = buildLayout<UserWelcomeEmailProps>(page => (
  <EmailLayout header="Welcome to OpenCal!">{page}</EmailLayout>
));

export default UserWelcomeEmail;
