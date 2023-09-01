import type { FC } from "react";
import type { BoxProps } from "@mantine/core";
import SubscribeIcon from "~icons/heroicons/device-phone-mobile-20-solid";

import { AddMobileSubscriberMutationDocument } from "~/helpers/graphql";

export type MobileSubscribeFormProps = Omit<BoxProps, "children"> & {
  readonly subjectId: string;
};

type MobileSubscribeFormValues = {
  readonly phone: string;
};

const MobileSubscribeForm: FC<MobileSubscribeFormProps> = ({
  subjectId,
  ...otherProps
}) => {
  const { getInputProps, setErrors, onSubmit, reset } =
    useForm<MobileSubscribeFormValues>({
      initialValues: {
        phone: "",
      },
    });

  // == Mutation
  const onAddError = useApolloAlertCallback("Failed to subscribe to updates");
  const [runAddMutation, { loading: adding }] = useMutation(
    AddMobileSubscriberMutationDocument,
    {
      onCompleted: ({ payload: { subscriber, errors } }) => {
        if (subscriber) {
          reset();
          showNotice({
            title: "You've subscribed to updates!",
            message: "You'll receive texts when new activities are added.",
          });
        } else {
          invariant(errors, "Missing input field errors");
          const formErrors = parseFormErrors(errors);
          setErrors(formErrors);
          showFormErrorsAlert(formErrors, "Couldn't subscribe to updates");
        }
      },
      onError: onAddError,
    },
  );

  return (
    <Box
      component="form"
      onSubmit={onSubmit(values => {
        runAddMutation({
          variables: {
            input: {
              subjectId,
              ...values,
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
          {...getInputProps("phone")}
        />
        <Button type="submit" leftIcon={<SubscribeIcon />} loading={adding}>
          Subscribe
        </Button>
      </Group>
    </Box>
  );
};

export default MobileSubscribeForm;
