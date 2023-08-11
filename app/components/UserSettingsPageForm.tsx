// import type { FC } from "react";

// import { UpdateUserProfileMutationDocument } from "~/helpers/graphql";
// import type { UserSettingsPageViewerFragment } from "~/helpers/graphql";

// import { Image, Input } from "@mantine/core";

// const AVATAR_FIELD_IMAGE_SIZE = 140;

// export type UserSettingsPageProfileFormValues = {
//   readonly name: string;
// };

// export type UserSettingsPageProfileFormProps = {
//   readonly viewer: UserSettingsPageViewerFragment;
// };

// const UserSettingsPageProfileForm: FC<UserSettingsPageProfileFormProps> = ({
//   viewer,
// }) => {
//   const { avatarUrl } = viewer;
//   const router = useRouter();

//   // == Form
//   const initialValues = useMemo<UserSettingsPageProfileFormValues>(() => {
//     const { name } = viewer;
//     return { name };
//   }, [viewer]);
//   const { getInputProps, onSubmit, setErrors, isDirty, setValues, resetDirty } =
//     useForm<UserSettingsPageProfileFormValues>({
//       initialValues,
//     });
//   useDidUpdate(() => {
//     setValues(initialValues);
//     resetDirty(initialValues);
//   }, [initialValues]);

//   // == Mutation
//   const onError = useApolloAlertCallback("Failed to update profile");
//   const [runMutation, { loading }] = useMutation(
//     UpdateUserProfileMutationDocument,
//     {
//       onCompleted: ({ payload: { user, errors } }) => {
//         if (user) {
//           router.reload({
//             onSuccess: () => {
//               showNotice({ message: "Profile updated successfully." });
//             },
//           });
//         } else {
//           invariant(errors, "Missing input errors");
//           const formErrors = parseFormErrors(errors);
//           setErrors(formErrors);
//           showFormErrorsAlert(formErrors, "Couldn't update profile");
//         }
//       },
//       onError,
//     },
//   );

//   // == Markup
//   return (
//     <form
//       onSubmit={onSubmit(values => {
//         runMutation({
//           variables: {
//             input: values,
//           },
//         });
//       })}
//     >
//       <Stack spacing="xs">
//         <TextInput
//           label="Name"
//           placeholder="A Friend"
//           required
//           {...getInputProps("name")}
//         />
//         <Input.Wrapper label="Avatar">
//           <Image
//             src={avatarUrl}
//             width={AVATAR_FIELD_IMAGE_SIZE}
//             height={AVATAR_FIELD_IMAGE_SIZE}
//             withPlaceholder
//             placeholder={<Skeleton radius="100%" width="100%" height="100%" />}
//             m={4}
//             styles={{
//               root: {
//                 overflow: "hidden",
//                 borderRadius: "100%",
//               },
//               figure: {
//                 transform: "scale(1.02)",
//               },
//               placeholder: {
//                 borderRadius: "100%",
//                 overflow: "hidden",
//               },
//             }}
//           />
//         </Input.Wrapper>
//         <Button type="submit" disabled={!isDirty()} {...{ loading }}>
//           Save
//         </Button>
//       </Stack>
//     </form>
//   );
// };

// export default UserSettingsPageProfileForm;
