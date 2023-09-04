import type { FC } from "react";
import { Text } from "@mantine/core";
import type { BoxProps } from "@mantine/core";

import EmailIcon from "~icons/heroicons/at-symbol-20-solid";
import PhoneIcon from "~icons/heroicons/phone-20-solid";

import type { ActivityReservationsActivityFragment } from "~/helpers/graphql";

export type ActivityReservationsProps = BoxProps & {
  readonly activity: ActivityReservationsActivityFragment;
};

const ActivityReservations: FC<ActivityReservationsProps> = ({
  activity: { reservations },
  ...otherProps
}) => {
  return (
    <Card withBorder bg="gray.0" {...otherProps}>
      <Stack spacing={8}>
        <Title order={3} size="h4">
          Who&apos;s coming?
        </Title>
        {!isEmpty(reservations) ? (
          reservations.map(
            ({ id: reservationId, name, email, phone, note }) => {
              return (
                <Card key={reservationId} withBorder py="xs" px="sm">
                  <Stack spacing={4}>
                    <Text weight={600} lh={1.3}>
                      {name}
                    </Text>
                    <Group spacing="lg" sx={{ rowGap: 0 }}>
                      <Group spacing={4} noWrap>
                        <Box component={EmailIcon} fz="xs" color="dark" />
                        <Anchor
                          href={`mailto:${encodeURIComponent(
                            name,
                          )}%20<${email}>`}
                          size="sm"
                          lh={1.3}
                        >
                          {email}
                        </Anchor>
                      </Group>
                      {!!phone && (
                        <Group spacing={4} noWrap>
                          <Box component={PhoneIcon} fz="xs" color="dark" />
                          <Anchor
                            href={`sms:${encodeURIComponent(phone)}`}
                            size="sm"
                            lh={1.3}
                          >
                            {phone}
                          </Anchor>
                        </Group>
                      )}
                    </Group>
                    {!!note && (
                      <Text size="sm" color="dimmed" lh={1.3}>
                        {note}
                      </Text>
                    )}
                  </Stack>
                </Card>
              );
            },
          )
        ) : (
          <EmptyCard itemLabel="reservations" />
        )}
      </Stack>
    </Card>
  );
};

export default ActivityReservations;
