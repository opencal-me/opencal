import type { FC } from "react";
import { Text } from "@mantine/core";
import type { BoxProps } from "@mantine/core";

import {
  UserBioQueryDocument,
  UpdateUserBioMutationDocument,
} from "~/helpers/graphql";
import type { Maybe } from "~/helpers/graphql";
import type { UserBioQuery } from "~/helpers/graphql";

export type UserBioProps = Omit<BoxProps, "children"> & {
  readonly userId: string;
  readonly children: Maybe<string> | undefined;
  readonly editable?: boolean;
  readonly onUpdate?: () => void;
};

const UserBio: FC<UserBioProps> = ({
  userId,
  children: initialBio,
  editable,
  onUpdate,
  ...otherProps
}) => {
  // == Query
  const initialData = useMemo<UserBioQuery>(
    () => ({
      user: {
        __typename: "User",
        id: userId,
        bio: initialBio,
      },
    }),
    [userId, initialBio],
  );
  const { coalescedData, loading } = usePreloadedQuery(UserBioQueryDocument, {
    variables: {
      userId,
    },
    initialData,
  });
  const { bio } = coalescedData?.user ?? {};

  // == Editing
  const [editing, setEditing] = useState(!bio);
  useDidUpdate(() => {
    setEditing(!bio);
  }, [bio]);

  useEffect(() => {
    console.log({ bio });
  }, [bio]);

  // == Form
  const formRef = useRef<HTMLFormElement>(null);
  const initialValues = useMemo<{ bio: string }>(
    () => ({ bio: bio ?? "" }),
    [bio],
  );
  const { getInputProps, onSubmit, setValues, setErrors } = useForm({
    initialValues,
  });
  useDidUpdate(() => {
    setValues(initialValues);
  }, [initialValues]);

  // == Mutation
  const onUpdateError = useApolloAlertCallback("Failed to update bio");
  const [runUpdateMutation, { loading: updating }] = useMutation(
    UpdateUserBioMutationDocument,
    {
      onCompleted: ({ payload: { user, errors } }) => {
        if (user) {
          showNotice({ message: "Bio updated successfully." });
          if (onUpdate) {
            onUpdate();
          }
        } else {
          invariant(errors, "Missing input field errors");
          const formErrors = parseFormErrors(errors);
          setErrors(formErrors);
          showFormErrorsAlert(formErrors, "Couldn't update bio");
        }
      },
      onError: onUpdateError,
    },
  );

  return (
    <Box<"div" | "form">
      ref={formRef}
      pos="relative"
      {...(editing && {
        component: "form",
        onSubmit: onSubmit(values => {
          runUpdateMutation({
            variables: {
              input: {
                userId,
                ...values,
              },
            },
          });
        }),
      })}
      {...otherProps}
    >
      {editing ? (
        <Textarea
          placeholder="Write a lil' bio about yourself."
          autosize
          minRows={2}
          maxRows={8}
          {...getInputProps("bio")}
        />
      ) : (
        <Text
          size="sm"
          color="gray.7"
          lh={1.3}
          sx={{
            whiteSpace: "pre-wrap",
          }}
        >
          {bio}
        </Text>
      )}
      {editable && (
        <Anchor
          component="button"
          size="sm"
          variant="outline"
          lh={1.3}
          disabled={updating}
          {...(editing
            ? {
                type: "submit",
              }
            : {
                onClick: () => {
                  setEditing(true);
                },
              })}
        >
          {editing ? (updating ? "Saving..." : "Save") : "Edit"}
        </Anchor>
      )}
      <LoadingOverlay visible={loading} />
    </Box>
  );
};

export default UserBio;