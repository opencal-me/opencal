import type { FC } from "react";
import type { BoxProps } from "@mantine/core";
import { Text } from "@mantine/core";

import type { UserShareProfileAlertUserFragment } from "~/helpers/graphql";

export type UserShareProfileAlertProps = Omit<
  BoxProps,
  "styles" | "children"
> & {
  readonly user: UserShareProfileAlertUserFragment;
};

const UserShareProfileAlert: FC<UserShareProfileAlertProps> = ({
  user: { url },
  ...otherProps
}) => {
  const urlLabel = useMemo(() => {
    const u = new URL(url);
    return `${u.host}${u.pathname}`;
  }, [url]);

  return (
    <Alert
      variant="filled"
      title={
        <Text span lineClamp={1}>
          Your profile is live:{" "}
          <Anchor
            component={Link}
            href={url}
            sx={({ white }) => ({
              color: white,
              textDecoration: "underline",
              wordBreak: "break-all",
            })}
          >
            {urlLabel}
          </Anchor>
        </Text>
      }
      styles={({ colors, fontSizes }) => ({
        title: {
          fontSize: fontSizes.lg,
          marginBottom: 0,
        },
        message: {
          color: colors.brand[0],
        },
      })}
      {...otherProps}
    >
      Share this link with the people you want to hang out with more :)
    </Alert>
  );
};

export default UserShareProfileAlert;
