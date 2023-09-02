import type { ComponentPropsWithoutRef, FC } from "react";
import type { BoxProps } from "@mantine/core";
import Cookie from "js-cookie";

import FormAuthenticityField from "./FormAuthenticityField";
import GoogleOAuthInstructions from "./GoogleOAuthInstructions";

export type UserLoginFormProps = BoxProps & ComponentPropsWithoutRef<"form">;

const UserLoginForm: FC<UserLoginFormProps> = ({ children, ...otherProps }) => (
  <Box
    component="form"
    action="/user/auth/google"
    method="post"
    onSubmit={event => {
      event.preventDefault();
      if (!Cookie.get("skip_google_oauth_instructions")) {
        openModal({
          title: "Signing in with Google",
          size: "lg",
          children: (
            <Stack>
              <GoogleOAuthInstructions />
              <Group position="right">
                <form action="/user/auth/google" method="post">
                  <FormAuthenticityField />
                  <Button type="submit">Ok, got it!</Button>
                </form>
              </Group>
            </Stack>
          ),
        });
      } else {
        event.currentTarget.submit();
      }
    }}
    {...otherProps}
  >
    <FormAuthenticityField />
    {children}
  </Box>
);

export default UserLoginForm;
