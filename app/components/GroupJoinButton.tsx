import type { FC } from "react";
import type { ButtonProps } from "@mantine/core";
import JoinIcon from "~icons/heroicons/hand-raised-20-solid";

import { JoinGroupMutationDocument } from "~/helpers/graphql";

export type GroupJoinButtonProps = Omit<ButtonProps, "onClick"> & {
  readonly groupId: string;
  readonly onJoin: () => void;
};

const GroupJoinButton: FC<GroupJoinButtonProps> = ({
  groupId,
  onJoin,
  children,
  ...otherProps
}) => {
  // == Mutation
  const onError = useApolloAlertCallback("Failed to join group");
  const [runMutation, { loading }] = useMutation(JoinGroupMutationDocument, {
    onCompleted: () => {
      showNotice({
        message: "Group joined successfully.",
      });
      onJoin();
    },
    onError,
  });

  // == Markup
  return (
    <Button
      leftIcon={<JoinIcon />}
      onClick={() => {
        runMutation({
          variables: {
            input: {
              groupId,
            },
          },
        });
      }}
      {...{ loading }}
      {...otherProps}
    >
      {children ?? "Join group"}
    </Button>
  );
};

export default GroupJoinButton;
