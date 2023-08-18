import type { FC } from "react";
import type { BoxProps } from "@mantine/core";
import JoinIcon from "~icons/heroicons/hand-raised-20-solid";

import { CreateReservationMutationDocument } from "~/helpers/graphql";

export type ReservationCreateFormProps = Omit<BoxProps, "children"> & {
  readonly activityId: string;
  readonly onReserve: () => void;
};

type ReservationCreateFormValues = {
  readonly name: string;
  readonly email: string;
};

export type ReservationCreateFormSubmission = ReservationCreateFormValues;

export const ReservationCreateForm: FC<ReservationCreateFormProps> = ({
  activityId,
  onReserve,
  ...otherProps
}) => {
  // == Form
  const { getInputProps, reset, setErrors, onSubmit, isDirty } = useForm<
    ReservationCreateFormValues,
    (values: ReservationCreateFormValues) => ReservationCreateFormSubmission
  >({
    initialValues: {
      name: "",
      email: "",
    },
    transformValues: ({ name, email }) => ({
      name: name.trim(),
      email: email.trim(),
    }),
  });

  // == Mutation
  const onError = useApolloAlertCallback("Failed to create reservation");
  const [runMutation, { loading: submitting }] = useMutation(
    CreateReservationMutationDocument,
    {
      onCompleted: ({ payload: { reservation, errors } }) => {
        if (reservation) {
          showNotice({
            title: "See you soon!",
            message: "We've sent you a calendar invitation :)",
          });
          onReserve();
          reset();
        } else {
          invariant(errors, "Missing input field errors");
          const formErrors = parseFormErrors(errors);
          setErrors(formErrors);
          showFormErrorsAlert(formErrors, "Couldn't create reservation");
        }
      },
      onError,
    },
  );

  // == Markup
  return (
    <Box
      component="form"
      onSubmit={onSubmit(values => {
        runMutation({
          variables: {
            input: {
              activityId,
              ...values,
            },
          },
        });
      })}
      {...otherProps}
    >
      <Stack>
        <Stack spacing={8}>
          <TextInput
            label="Name"
            placeholder="Scott Langille"
            required
            {...getInputProps("name")}
          />
          <TextInput
            label="Email"
            description="A calendar invititation will be sent to this email address."
            placeholder="scott@example.com"
            required
            {...getInputProps("email")}
          />
        </Stack>
        <Group position="right" spacing="xs">
          <Button
            type="submit"
            leftIcon={<JoinIcon />}
            loading={submitting}
            disabled={!isDirty()}
          >
            I&apos;ll be there!
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};
