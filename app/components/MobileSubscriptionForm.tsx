import type { FC } from "react";
import type { BoxProps } from "@mantine/core";

import { CreateMobileSubscriptionMutationDocument } from "~/helpers/graphql";

export type MobileSubscriptionFormProps = Omit<BoxProps, "children"> & {
  readonly subjectId: string;
};

type MobileSubscriptionFormValues = {
  readonly subscriberPhone: string;
};

const MobileSubscriptionForm: FC<MobileSubscriptionFormProps> = ({
  subjectId,
  ...otherProps
}) => {
  const { getInputProps, setErrors, onSubmit, reset } =
    useForm<MobileSubscriptionFormValues>({
      initialValues: {
        subscriberPhone: "",
      },
    });

  // == Mutation
  const onCreateError = useApolloAlertCallback(
    "Failed to subscribe to updates",
  );
  const [runCreateMutation, { loading: adding }] = useMutation(
    CreateMobileSubscriptionMutationDocument,
    {
      onCompleted: ({ payload: { subscription, errors } }) => {
        if (subscription) {
          reset();
          showNotice({
            title: "You're subscribed to updates!",
            message: "You'll receive texts when new activities are added.",
          });
        } else {
          invariant(errors, "Missing input field errors");
          const formErrors = parseFormErrors(errors);
          setErrors(formErrors);
          showFormErrorsAlert(formErrors, "Couldn't subscribe to updates");
        }
      },
      onError: onCreateError,
    },
  );

  return (
    <Box
      component="form"
      onSubmit={onSubmit(({ subscriberPhone }) => {
        runCreateMutation({
          variables: {
            input: {
              subjectId,
              subscriberPhone,
            },
          },
        });
      })}
      {...otherProps}
    >
      <Group align="start" spacing={8} noWrap>
        <TextInput
          variant="filled"
          placeholder="+1 (555) 555-5555"
          styles={({ fontSizes, colors }) => ({
            root: {
              flexGrow: 1,
            },
            input: {
              fontSize: fontSizes.md,
              border: `${rem(1)} solid ${colors.gray[3]}`,
            },
          })}
          {...getInputProps("subscriberPhone")}
        />
        <Button type="submit" leftIcon={<PhoneIcon />} loading={adding}>
          Subscribe
        </Button>
      </Group>
    </Box>
  );
};

export default MobileSubscriptionForm;
