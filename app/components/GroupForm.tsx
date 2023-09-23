import type { FC } from "react";
import slugify from "slugify";

import { Code, Text } from "@mantine/core";
import type { BoxProps } from "@mantine/core";
import type { FormErrors } from "@mantine/form";

import { GroupFormQueryDocument } from "~/helpers/graphql";

export type GroupFormProps = Omit<BoxProps, "children"> & {
  readonly onSubmit: (submission: GroupFormSubmission) => void;
  readonly submitting: boolean;
  readonly errors: FormErrors | undefined;
  readonly groupId?: string;
};

type GroupFormValues = {
  readonly name: string;
  readonly handle: string;
};

export type GroupFormSubmission = GroupFormValues;

const GroupForm: FC<GroupFormProps> = ({
  onSubmit: handleSubmit,
  submitting,
  errors,
  groupId,
  ...otherProps
}) => {
  // == Query
  const onError = useApolloAlertCallback("Failed to load group");
  const { data, loading } = useQuery(GroupFormQueryDocument, {
    variables: groupId ? { groupId } : undefined,
    skip: !groupId,
    onError,
  });
  const { group } = data ?? {};

  // == Form
  const initialValues = useMemo<GroupFormValues>(() => {
    const { name, handle } = group ?? {};
    return {
      name: name ?? "",
      handle: handle ?? "",
    };
  }, [group]);
  const {
    values,
    getInputProps,
    setFieldValue,
    setValues,
    setErrors,
    resetDirty,
    clearErrors,
    isDirty,
    onSubmit,
  } = useForm<
    GroupFormValues,
    (values: GroupFormValues) => GroupFormSubmission
  >({ initialValues });
  useDidUpdate(() => {
    setValues(initialValues);
    resetDirty(initialValues);
  }, [initialValues]);
  useDidUpdate(() => {
    if (!group) {
      setFieldValue(
        "handle",
        slugify(values.name, { replacement: "_", lower: true }),
      );
    }
  }, [values.name, group]);
  useDidUpdate(() => {
    if (errors) {
      setErrors(errors);
    } else {
      clearErrors();
    }
  }, [errors]);

  return (
    <Box
      component="form"
      onSubmit={onSubmit(handleSubmit)}
      pos="relative"
      {...otherProps}
    >
      <Stack spacing="lg">
        <Stack spacing="xs">
          <TextInput
            label="Name"
            placeholder="The Residency"
            required
            {...getInputProps("name")}
          />
          <Box>
            <TextInput
              label="Handle"
              placeholder="the_residency"
              description="Lowercase letters, numbers, and underscores only."
              pattern="[a-z0-9_]+"
              disabled={!!group}
              required
              {...getInputProps("handle")}
            />
            {!!values.handle && (
              <Text size="xs" color="dimmed" mt={4}>
                You can share activities to your group with:{" "}
                <Code sx={{ whiteSpace: "nowrap" }}>
                  [open @{values.handle}]
                </Code>
              </Text>
            )}
          </Box>
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
      <LoadingOverlay visible={loading} />
    </Box>
  );
};

export default GroupForm;
