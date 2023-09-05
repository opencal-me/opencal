import type { ComponentType, FC } from "react";
import { Text } from "@mantine/core";
import type { BoxProps, TextProps } from "@mantine/core";

import Linkify from "linkify-react";

import {
  UserBioQueryDocument,
  UpdateUserBioMutationDocument,
} from "~/helpers/graphql";
import type { UserBioUserFragment } from "~/helpers/graphql";

export type UserBioProps = Omit<BoxProps, "children"> & {
  readonly user: UserBioUserFragment;
  readonly editable?: boolean;
  readonly onUpdate?: () => void;
};

const UserBio: FC<UserBioProps> = ({
  user: initialUser,
  editable,
  onUpdate,
  ...otherProps
}) => {
  const { id: userId } = initialUser;

  // == Query
  const { coalescedData, loading } = usePreloadedQuery(UserBioQueryDocument, {
    variables: {
      userId,
    },
    initialData: {
      user: initialUser,
    },
  });
  const { user } = coalescedData ?? {};
  const { bio } = user ?? {};

  // == Editing
  const [editing, setEditing] = useState(false);

  // == Form
  const formRef = useRef<HTMLFormElement>(null);
  const initialValues = useMemo<{ readonly bio: string }>(() => {
    const { bio } = user ?? {};
    return { bio: bio ?? "" };
  }, [user]);
  const { getInputProps, onSubmit, setValues, setErrors, reset } = useForm({
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
          setEditing(false);
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
          placeholder="Tell us a lil' bit about yourself!"
          autosize
          minRows={2}
          maxRows={8}
          mb={4}
          {...getInputProps("bio")}
        />
      ) : (
        <Linkify<TextProps, ComponentType<TextProps>>
          as={Text}
          options={{
            render: ({ attributes, content }) => (
              <Anchor
                {...attributes}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                {content}
              </Anchor>
            ),
          }}
          size="sm"
          color="gray.7"
          lh={1.3}
          sx={{ textTransform: "none", whiteSpace: "pre-wrap" }}
        >
          {bio}
        </Linkify>
      )}
      {editable && (
        <Group align="start" position="apart" spacing={8} fz="sm">
          <Group spacing={8} fz="sm">
            {editing && (
              <Anchor
                component="button"
                color="gray.6"
                inherit
                onClick={() => {
                  setEditing(false);
                  reset();
                }}
              >
                Cancel
              </Anchor>
            )}
            <Anchor
              component="button"
              inherit
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
              {editing
                ? updating
                  ? "Saving..."
                  : "Save"
                : bio
                ? "Edit bio"
                : "Add a bio"}
            </Anchor>
          </Group>
          {editing && (
            <Text size="xs" color="dimmed">
              Try adding a link, it works!
            </Text>
          )}
        </Group>
      )}
      <LoadingOverlay visible={loading} />
    </Box>
  );
};

export default UserBio;
