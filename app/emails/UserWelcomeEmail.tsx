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
      <Text>Hey {firstName}!</Text>
      <Text>
        Thanks for making an account on OpenCal.
        <br />
        We&apos;ll keep you posted when we have updates to share :)
      </Text>
    </>
  );
};

UserWelcomeEmail.layout = buildLayout<UserWelcomeEmailProps>(page => (
  <EmailLayout header="Welcome">{page}</EmailLayout>
));

export default UserWelcomeEmail;
