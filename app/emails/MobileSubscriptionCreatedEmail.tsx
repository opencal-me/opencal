import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Text, Link, Button } from "@react-email/components";

import EmailLayout from "~/components/EmailLayout";

import type { MobileSubscriptionCreatedEmailQuery } from "~/helpers/graphql";

export type MobileSubscriptionCreatedEmailProps =
  PagePropsWithData<MobileSubscriptionCreatedEmailQuery> & {
    readonly homepageUrl: string;
  };

const MobileSubscriptionCreatedEmail: PageComponent<
  MobileSubscriptionCreatedEmailProps
> = ({ data: { subscription }, homepageUrl }) => {
  invariant(subscription, "Missing subscription");
  const { subject, subscriber } = subscription;

  return (
    <>
      <Text>Hey {subject.firstName}!</Text>
      <Text style={{ lineHeight: "20px" }}>
        <Link href={`sms:${encodeURIComponent(subscriber.phone)}`}>
          {subscriber.phone}
        </Link>{" "}
        has subscribed to your OpenCal activities.
      </Text>
      <Text>
        You can manage your subscribers in the &apos;Your Subscribers&apos;
        section on OpenCal.
      </Text>
      <Box
        component={Button}
        href={homepageUrl}
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
        Open OpenCal
      </Box>
    </>
  );
};

MobileSubscriptionCreatedEmail.layout =
  buildLayout<MobileSubscriptionCreatedEmailProps>(page => (
    <EmailLayout header="New Subscription">{page}</EmailLayout>
  ));

export default MobileSubscriptionCreatedEmail;
