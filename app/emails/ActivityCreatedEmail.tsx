import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Text, Link, Button } from "@react-email/components";

import EmailLayout from "~/components/EmailLayout";

import type { ActivityCreatedEmailQuery } from "~/helpers/graphql";

export type ActivityCreatedEmailProps =
  PagePropsWithData<ActivityCreatedEmailQuery>;

const ActivityCreatedEmail: PageComponent<ActivityCreatedEmailProps> = ({
  data: { activity },
}) => {
  invariant(activity, "Missing activity");
  const { name, owner, url } = activity;
  return (
    <>
      <Text>Hey {owner.firstName}!</Text>
      <Text style={{ lineHeight: "20px" }}>
        You&apos;ve created an activity by marking an event as{" "}
        <Box
          component="span"
          sx={({ fontFamilyMonospace, white, colors }) => ({
            fontFamily: fontFamilyMonospace,
            color: white,
            backgroundColor: colors.dark[3],
          })}
        >
          [open]
        </Box>{" "}
        on your calendar:{" "}
        <Link href={url} target="_blank" style={{ textTransform: "none" }}>
          {name}
        </Link>
      </Text>
      <Text>Share this link with anyone you&apos;d like to invite :)</Text>
      <Box
        component={Button}
        href={url}
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
        Open activity
      </Box>
    </>
  );
};

ActivityCreatedEmail.layout = buildLayout<ActivityCreatedEmailProps>(page => (
  <EmailLayout header="Activity created">{page}</EmailLayout>
));

export default ActivityCreatedEmail;
