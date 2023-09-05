import type { FC } from "react";
import type { ButtonProps } from "@mantine/core";

import { ConvertGoogleEventMutationDocument } from "~/helpers/graphql";
import type { GoogleEventConvertButtonActivityFragment } from "~/helpers/graphql";

export type GoogleEventConvertButtonProps = Omit<
  ButtonProps,
  "loading" | "onClick"
> & {
  readonly googleEventId: string;
  readonly onConvert: (
    activity: GoogleEventConvertButtonActivityFragment,
  ) => void;
};

const GoogleEventConvertButton: FC<GoogleEventConvertButtonProps> = ({
  googleEventId,
  onConvert,
  children,
  ...otherProps
}) => {
  // == Mutation
  const onError = useApolloAlertCallback("Failed to create activity");
  const [runMutation, { loading }] = useMutation(
    ConvertGoogleEventMutationDocument,
    {
      onCompleted: ({ payload: { activity, errors } }) => {
        if (activity) {
          showNotice({ message: "Activity created successfully." });
          onConvert(activity);
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
      {children ?? "Create activity"}
    </Button>
  );
};

export default GoogleEventConvertButton;
