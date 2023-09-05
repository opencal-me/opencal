import type { FC } from "react";
import { Select } from "@mantine/core";
import type { BoxProps, SelectItem } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";

import { CreateActivityMutationDocument } from "~/helpers/graphql";
import type { ActivityCreateFormActivityFragment } from "~/helpers/graphql";

export type ActivityCreateFormProps = Omit<BoxProps, "children"> & {
  readonly onCreate: (activity: ActivityCreateFormActivityFragment) => void;
};

type ActivityCreateFormValues = {
  readonly name: string;
  readonly start: Date;
  readonly durationSeconds: string;
  readonly location: string;
  readonly description: string;
};

export type ActivityCreateFormSubmission = Omit<
  ActivityCreateFormValues,
  "start" | "durationSeconds"
> & {
  readonly start: string;
  readonly durationSeconds: number;
};

const ActivityCreateForm: FC<ActivityCreateFormProps> = ({
  onCreate,
  ...otherProps
}) => {
  // == Form
  const { getInputProps, reset, onSubmit, isDirty } = useForm<
    ActivityCreateFormValues,
    (values: ActivityCreateFormValues) => ActivityCreateFormSubmission
  >({
    initialValues: {
      name: "",
      start: new Date(),
      durationSeconds: "3600",
      location: "",
      description: "",
    },
    transformValues: ({
      name,
      start,
      durationSeconds,
      location,
      description,
    }) => {
      invariant(start, "Missing start");
      return {
        name: name.trim(),
        start: DateTime.fromJSDate(start).toISO(),
        durationSeconds: parseInt(durationSeconds),
        location: location.trim(),
        description: description.trim(),
      };
    },
  });

  // == Mutation
  const onError = useApolloAlertCallback("Failed to create activity");
  const [runMutation, { loading: submitting }] = useMutation(
    CreateActivityMutationDocument,
    {
      onCompleted: ({ payload: { activity } }) => {
        showNotice({
          message: "Activity created successfully.",
        });
        onCreate(activity);
        reset();
      },
      onError,
    },
  );

  // == Duration Select
  const durationSelectData = useMemo<SelectItem[]>(
    () => [
      { value: (60 * 30).toString(), label: "30 minutes" },
      { value: (60 * 60).toString(), label: "1 hour" },
      { value: (60 * 90).toString(), label: "90 minutes" },
    ],
    [],
  );

  return (
    <Box
      component="form"
      onSubmit={onSubmit(values => {
        runMutation({
          variables: {
            input: {
              ...values,
            },
          },
        });
      })}
      {...otherProps}
    >
      <Stack spacing="lg">
        <Stack spacing="sm">
          <TextInput
            label="Name"
            placeholder="a walk in the park"
            required
            size="md"
            {...getInputProps("name")}
          />
          <TextInput
            label="Location"
            placeholder="UBC Rose Garden, Crescent Road, Vancouver, BC"
            size="md"
            {...getInputProps("location")}
          />
          <Textarea
            label="Description"
            placeholder={
              "We're going to gather near the entrance and make our way down " +
              "to the rose garden."
            }
            size="md"
            autosize
            minRows={2}
            maxRows={6}
            {...getInputProps("description")}
          />
          <DateTimePicker
            label="Start"
            required
            size="md"
            firstDayOfWeek={0}
            valueFormat="LLL"
            popoverProps={{
              withArrow: true,
              withinPortal: true,
            }}
            {...getInputProps("start")}
          />
          <Select
            label="Duration"
            required
            data={durationSelectData}
            size="md"
            {...getInputProps("durationSeconds")}
          />
        </Stack>
        <Group position="right" spacing="xs">
          <Button
            type="submit"
            leftIcon={<AddIcon />}
            loading={submitting}
            disabled={!isDirty()}
          >
            Create
          </Button>
        </Group>
      </Stack>
    </Box>
  );
};

export default ActivityCreateForm;
