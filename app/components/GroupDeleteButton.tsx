import type { FC } from "react";

import { DeleteGroupMutationDocument } from "~/helpers/graphql";

import DeleteButton from "./DeleteButton";
import type { DeleteButtonProps } from "./DeleteButton";

export type GroupDeleteButtonProps = Omit<DeleteButtonProps, "onConfirm"> & {
  readonly groupId: string;
  readonly onDelete: () => void;
};

const GroupDeleteButton: FC<GroupDeleteButtonProps> = ({
  groupId,
  onDelete,
  children,
  ...otherProps
}) => {
  // == Mutation
  const onError = useApolloAlertCallback("Failed to delete group");
  const [runMutation, { loading }] = useMutation(DeleteGroupMutationDocument, {
    onCompleted: () => {
      showNotice({
        message: "Group deleted successfully.",
      });
      onDelete();
    },
    onError,
  });

  // == Markup
  return (
    <DeleteButton
      leftIcon={<DeleteIcon />}
      onConfirm={() => {
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
      {children ?? "Delete group"}
    </DeleteButton>
  );
};

export default GroupDeleteButton;
