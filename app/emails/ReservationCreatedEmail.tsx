import type { PageComponent, PagePropsWithData } from "~/helpers/inertia";
import { Text, Link, Button } from "@react-email/components";

import EmailLayout from "~/components/EmailLayout";

import type { ReservationCreatedEmailQuery } from "~/helpers/graphql";

export type ReservationCreatedEmailProps =
  PagePropsWithData<ReservationCreatedEmailQuery>;

const ReservationCreatedEmail: PageComponent<ReservationCreatedEmailProps> = ({
  data: { reservation },
}) => {
  invariant(reservation, "Missing reservation");
  const { activity } = reservation;
  const { owner } = activity;
  return (
    <>
      <Text>Hi, {owner.firstName}!</Text>
      <Text style={{ lineHeight: "20px" }}>
        {reservation.name} (
        <Link
          href={`mailto:${encodeURIComponent(reservation.name)}%20<${
            reservation.email
          }>`}
        >
          {reservation.email}
        </Link>
        ) would like to join you for your activity,{" "}
        <Link href={activity.url} target="_blank">
          {activity.name}
        </Link>
      </Text>
      {reservation.phone && (
        <Text>
          If you need to contact {reservation.name}, you can reach them at{" "}
          <Link href={`sms:${encodeURIComponent(reservation.phone)}`}>
            {reservation.phone}
          </Link>
          .
        </Text>
      )}
      <Box
        component={Button}
        href={activity.url}
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
        Open Activity
      </Box>
    </>
  );
};

ReservationCreatedEmail.layout = buildLayout<ReservationCreatedEmailProps>(
  page => <EmailLayout header="Reservation Created">{page}</EmailLayout>,
);

export default ReservationCreatedEmail;
