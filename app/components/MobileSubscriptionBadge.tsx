import type { FC } from "react";
import MenuIcon from "~icons/heroicons/ellipsis-horizontal-circle-20-solid";

import { ActionIcon } from "@mantine/core";
import type { BoxProps } from "@mantine/core";

import { DeleteMobileSubscriptionMutationDocument } from "~/helpers/graphql";
import type { MobileSubscriptionBadgeSubscriptionFragment } from "~/helpers/graphql";

export type MobileSubscriptionBadgeProps = Omit<BoxProps, "children"> & {
  readonly subscription: MobileSubscriptionBadgeSubscriptionFragment;
  readonly onDelete: () => void;
};

const MobileSubscriptionBadge: FC<MobileSubscriptionBadgeProps> = ({
  subscription: { id: subscriptionId, subscriber },
  sx,
  onDelete,
  ...otherProps
}) => {
  // == Mutation
  const onDeleteError = useApolloAlertCallback("Failed to remove subscriber");
  const [runDeleteMutation, { loading: deleting }] = useMutation(
    DeleteMobileSubscriptionMutationDocument,
    {
      onCompleted: () => {
        showNotice({
          message: "Subscriber has been removed.",
        });
        onDelete();
      },
      onError: onDeleteError,
    },
  );

  return (
    <Badge
      variant="outline"
      rightSection={
        <Menu>
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              color="brand"
              size="xs"
              loading={deleting}
            >
              <MenuIcon />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              color="red"
              icon={<DeleteIcon />}
              onClick={() => {
                runDeleteMutation({
                  variables: {
                    input: {
                      subscriptionId,
                    },
                  },
                });
              }}
            >
              Remove Subscriber
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      }
      color="gray"
      size="lg"
      radius="md"
      px={8}
      sx={[
        ...packSx(sx),
        {
          "&:hover": {
            textDecoration: "underline",
          },
        },
      ]}
      {...otherProps}
    >
      <Anchor
        href={`sms:${encodeURIComponent(subscriber.phone)}`}
        sx={{ color: "inherit" }}
      >
        {subscriber.phone}
      </Anchor>
    </Badge>
  );
};

export default MobileSubscriptionBadge;
