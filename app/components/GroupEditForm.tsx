import type { FC } from "react";
import type { BoxProps } from "@mantine/core";
import type { FormErrors } from "@mantine/form";

import { UpdateGroupMutationDocument } from "~/helpers/graphql";

import GroupForm from "./GroupForm";

export type GroupEditFormProps = Omit<BoxProps, "children"> & {
  readonly groupId: string;
  readonly onUpdate: () => void;
};

const GroupEditForm: FC<GroupEditFormProps> = ({
  groupId,
  onUpdate,
  ...otherProps
}) => {
  const [errors, setErrors] = useState<FormErrors>({});

  // == Mutation
  const onError = useApolloAlertCallback("Failed to update group");
  const [runMutation, { loading: submitting }] = useMutation(
    UpdateGroupMutationDocument,
    {
      onCompleted: ({ payload: { group, errors } }) => {
        if (group) {
          closeAllModals();
          showNotice({ message: "Group updated successfully." });
          onUpdate();
        } else {
          invariant(errors, "Missing input errors");
          const formErrors = parseFormErrors(errors);
          setErrors(formErrors);
          showFormErrorsAlert(formErrors, "Couldn't update group");
        }
      },
      onError: onError,
    },
  );

  // == Markup
  return (
    <GroupForm
      onSubmit={submission => {
        runMutation({
          variables: {
            input: {
              groupId,
              ...omit(submission, "handle"),
            },
          },
        });
      }}
      {...{ submitting, errors, groupId }}
      {...otherProps}
    />
  );
};

export default GroupEditForm;
