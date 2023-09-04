import type { FC } from "react";
import type { BoxProps } from "@mantine/core";
import JoinIcon from "~icons/heroicons/hand-raised-20-solid";

import { CreateReservationMutationDocument } from "~/helpers/graphql";
import type { ReservationCreateFormActivityFragment } from "~/helpers/graphql";

export type ReservationCreateFormProps = Omit<BoxProps, "children"> & {
  readonly activity: ReservationCreateFormActivityFragment;
  readonly onReserve: () => void;
};

type ReservationCreateFormValues = {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly note: string;
};

export type ReservationCreateFormSubmission = ReservationCreateFormValues;

export const ReservationCreateForm: FC<ReservationCreateFormProps> = ({
  activity: { id: activityId, owner },
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
      phone: "",
      note: "",
    },
    transformValues: ({ name, email, phone, note }) => ({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      note: note.trim(),
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

  // == Note
  const [showNoteField, setShowNoteField] = useState(false);

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
      <Stack spacing="lg">
        <Stack>
          <TextInput
            label="Name"
            placeholder="Scott Langille"
            required
            size="md"
            {...getInputProps("name")}
          />
          <TextInput
            label="Email"
            description="We'll send you a calendar invite to this email address."
            placeholder="scott@example.com"
            required
            size="md"
            {...getInputProps("email")}
          />
          <TextInput
            label="Phone Number"
            description={
              <>
                In case something comes up, so {owner.firstName} can contact
                you.
              </>
            }
            placeholder="+1 (555) 555-5555"
            size="md"
            {...getInputProps("phone")}
          />
          <Box>
            {showNoteField && (
              <Textarea
                label="Note"
                description="A little note for the organizer."
                size="md"
                autosize
                minRows={2}
                {...getInputProps("note")}
              />
            )}
            <Anchor
              component="button"
              size="sm"
              onClick={() => {
                setShowNoteField(showNoteField => !showNoteField);
              }}
            >
              {showNoteField ? "Hide note field" : "Add a note"}
            </Anchor>
          </Box>
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
