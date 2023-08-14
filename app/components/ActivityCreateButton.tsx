import type { FC } from "react";
import type { ButtonProps } from "@mantine/core";
import {
  ActivityCreateButtonActivityFragment,
  CreateActivityMutationDocument,
} from "~/helpers/graphql";

export type ActivityCreateButtonProps = Omit<
  ButtonProps,
  "loading" | "onClick"
> & {
  readonly googleEventId: string;
  readonly onCreate: (activity: ActivityCreateButtonActivityFragment) => void;
};

const ActivityCreateButton: FC<ActivityCreateButtonProps> = ({
  googleEventId,
  onCreate,
  children,
  ...otherProps
}) => {
  // == Mutation
  const onError = useApolloAlertCallback("Failed to create activity");
  const [runMutation, { loading }] = useMutation(
    CreateActivityMutationDocument,
    {
      onCompleted: ({ payload: { activity, errors } }) => {
        if (activity) {
          showNotice({ message: "Activity created successfully." });
          onCreate(activity);
        } else {
          invariant(errors, "Missing input field errors");
          const formErrors = parseFormErrors(errors);
          showFormErrorsAlert(formErrors, "Couldn't create activity");
        }
      },
      onError,
    },
  );

  return (
    <Button
      leftIcon={<AddIcon />}
      onClick={() => {
        runMutation({
          variables: {
            input: {
              googleEventId,
            },
          },
        });
      }}
      {...{ loading }}
      {...otherProps}
    >
      {children ?? "Create Activity"}
    </Button>
  );
};

export default ActivityCreateButton;
