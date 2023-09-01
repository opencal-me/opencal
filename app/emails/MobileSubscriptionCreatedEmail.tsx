import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Text, Link, Button } from "@react-email/components";

import EmailLayout from "~/components/EmailLayout";

import type { MobileSubscriptionCreatedEmailQuery } from "~/helpers/graphql";

export type MobileSubscriptionCreatedEmailProps =
  PagePropsWithData<MobileSubscriptionCreatedEmailQuery> & {
    readonly subscriberPhone: string;
  };

const MobileSubscriptionCreatedEmail: PageComponent<
  MobileSubscriptionCreatedEmailProps
> = ({ data: { subject }, subscriberPhone }) => {
  invariant(subject, "Missing subject");
  return (
    <>
      <Text>Hi OpenCal Team!</Text>
      <Text style={{ lineHeight: "20px" }}>
        {subscriberPhone} has subscribed to activities from{" "}
        <Link href={subject.url} target="_blank">
          {subject.name}
        </Link>
      </Text>
      <Text>Just wanted to keep you guys in the know :)</Text>
      <Box
        component={Button}
        href={subject.url}
        target="_blank"
        pX={20}
        pY={10}
        bg="brand"
        fw={600}
        sx={({ white, radius }) => ({
          color: white,
          borderRadius: radius.sm,
        })}
      >
        Open {subject.name}&apos;s Profile
      </Box>
    </>
  );
};

MobileSubscriptionCreatedEmail.layout =
  buildLayout<MobileSubscriptionCreatedEmailProps>(page => (
    <EmailLayout header="MobileSubscriber Added">{page}</EmailLayout>
  ));

export default MobileSubscriptionCreatedEmail;
