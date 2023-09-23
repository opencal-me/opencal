import type { FC } from "react";
import type { BoxProps } from "@mantine/core";
import type { FormErrors } from "@mantine/form";

import { CreateGroupMutationDocument } from "~/helpers/graphql";
import type { GroupCreateFormGroupFragment } from "~/helpers/graphql";

import GroupForm from "./GroupForm";

export type GroupCreateFormProps = Omit<BoxProps, "children"> & {
  readonly onCreate: (group: GroupCreateFormGroupFragment) => void;
};

const GroupCreateForm: FC<GroupCreateFormProps> = ({
  onCreate,
  ...otherProps
}) => {
  const [errors, setErrors] = useState<FormErrors | undefined>();

  // == Mutation
  const onError = useApolloAlertCallback("Failed to create group");
  const [runMutation, { loading: submitting }] = useMutation(
    CreateGroupMutationDocument,
    {
      onCompleted: ({ payload: { group, errors } }) => {
        if (group) {
          onCreate(group);
        } else {
          invariant(errors, "Missing input errors");
          const formErrors = parseFormErrors(errors);
          setErrors(formErrors);
          showFormErrorsAlert(formErrors, "Couldn't create group");
        }
      },
      onError,
    },
  );

  return (
    <GroupForm
      onSubmit={submission => {
        runMutation({
          variables: {
            input: submission,
          },
        });
      }}
      {...{ submitting, errors }}
      {...otherProps}
    />
  );
};

export default GroupCreateForm;
