import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Text } from "@react-email/components";

import EmailLayout from "~/components/EmailLayout";

import type { UserPasswordChangedEmailQuery } from "~/helpers/graphql";

export type UserPasswordChangedEmailProps =
  PagePropsWithData<UserPasswordChangedEmailQuery>;

const UserPasswordChangedEmail: PageComponent<
  UserPasswordChangedEmailProps
> = ({ data: { user } }) => {
  invariant(user, "Missing user");
  const { firstName } = user;
  return (
    <>
      <Text>Hi, {firstName}!</Text>
      <Text>
        We&apos;re contacting you to let you know that your password has been
        changed.
      </Text>
    </>
  );
};

UserPasswordChangedEmail.layout = buildLayout<UserPasswordChangedEmailProps>(
  page => <EmailLayout header="Password changed">{page}</EmailLayout>,
);

export default UserPasswordChangedEmail;
