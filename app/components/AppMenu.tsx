import type { FC } from "react";
import { format as formatTimeAgo } from "timeago.js";

import CogIcon from "~icons/heroicons/cog-6-tooth-20-solid";
import SignOutIcon from "~icons/heroicons/arrow-left-on-rectangle-20-solid";
import HomeIcon from "~icons/heroicons/home-20-solid";

import { Text } from "@mantine/core";
import type { BoxProps, BadgeProps } from "@mantine/core";

import { createApolloLink } from "~/helpers/apollo";
import type { SharedPageProps } from "~/helpers/inertia";

import { AppMenuQueryDocument } from "~/helpers/graphql";
import type { AppViewerFragment } from "~/helpers/graphql";
import type { Maybe } from "~/helpers/graphql";

import UserLoginForm from "./UserLoginForm";

export type AppMenuProps = Pick<BoxProps, "sx"> & {
  readonly viewer: Maybe<AppViewerFragment>;
};

const AppMenu: FC<AppMenuProps> = ({ viewer, sx }) => {
  const router = useRouter();
  const client = useApolloClient();
  const theme = useMantineTheme();

  // == State
  const [opened, setOpened] = useState(false);

  // == Badge
  const badgeActiveColor = theme.colors.gray[5];
  const badgeProps = useMemo<BadgeProps>(
    () => ({
      variant: "dot",
      sx: [
        ...packSx(sx),
        {
          textTransform: "unset",
          borderColor: opened ? badgeActiveColor : undefined,
          "&:hover": {
            borderColor: badgeActiveColor,
          },
          cursor: "pointer",
        },
      ],
    }),
    [opened],
  );

  // == Query
  const onError = useApolloAlertCallback("Failed to load server info");
  const skipQuery = !viewer?.isAdmin || !opened;
  const { data } = useQuery(AppMenuQueryDocument, {
    skip: skipQuery,
    onError,
  });
  const { bootedAt } = data ?? {};

  // == Markup
  return viewer ? (
    <Menu
      trigger="hover"
      position="bottom-end"
      offset={4}
      width={200}
      onChange={setOpened}
      styles={({ colors }) => ({
        dropdown: { padding: "0 !important" },
        item: {
          padding: "8px 10px",
          borderRadius: 0,
        },
        itemIcon: {
          width: 16,
          height: 16,
          color: colors.black,
        },
        itemLabel: {
          color: colors.gray[7],
          fontWeight: 500,
        },
      })}
    >
      <Menu.Target>
        <Badge variant="dot" color={theme.primaryColor} {...badgeProps}>
          {viewer.firstName}
        </Badge>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component={Link} href="/home" icon={<HomeIcon />}>
          Home
        </Menu.Item>
        <Menu.Item component={Link} href={viewer.url} icon={<UserIcon />}>
          Profile
        </Menu.Item>
        <Menu.Item component={Link} href="/user/settings" icon={<CogIcon />}>
          Settings
        </Menu.Item>
        <Menu.Item
          icon={<SignOutIcon />}
          onClick={() => {
            router.post("/logout", undefined, {
              onSuccess: ({ props }) => {
                const { csrf } = props as unknown as SharedPageProps;
                const link = createApolloLink({ csrfToken: csrf.token });
                client.setLink(link);
                client.resetStore();
              },
            });
          }}
        >
          Sign Out
        </Menu.Item>
        {!skipQuery && (
          <>
            <Menu.Divider />
            <Menu.Item disabled pt={4}>
              <Text size="xs" color="dimmed">
                Server booted{" "}
                {bootedAt ? (
                  <Time format={time => formatTimeAgo(time.toJSDate())}>
                    {bootedAt}
                  </Time>
                ) : (
                  <Skeleton
                    display="inline-block"
                    height="min-content"
                    width="fit-content"
                    sx={{ verticalAlign: "middle" }}
                  >
                    <Text inherit>2 minutes ago</Text>
                  </Skeleton>
                )}
              </Text>
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  ) : (
    <UserLoginForm>
      <Badge component="button" type="submit" color="gray.4" {...badgeProps}>
        Sign in
      </Badge>
    </UserLoginForm>
  );
};

export default AppMenu;
