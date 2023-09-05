import type { FC } from "react";
import type { ButtonProps } from "@mantine/core";
import ConvertIcon from "~icons/heroicons/arrows-right-left-20-solid";
import ChevronIcon from "~icons/heroicons/chevron-down-20-solid";

import type { ActivityCreateButtonActivityFragment } from "~/helpers/graphql";

import GoogleEvents from "./GoogleEvents";
import ActivityCreateForm from "./ActivityCreateForm";

export type ActivityCreateButtonProps = Omit<
  ButtonProps,
  "loading" | "onClick"
> & {
  readonly onCreate: (activity: ActivityCreateButtonActivityFragment) => void;
};

const ActivityCreateButton: FC<ActivityCreateButtonProps> = ({
  onCreate,
  children,
  ...otherProps
}) => (
  <Menu
    withArrow
    position="bottom-start"
    styles={({ fn }) => ({
      itemIcon: {
        color: fn.primaryColor(),
      },
    })}
  >
    <Menu.Target>
      <Button leftIcon={<ChevronIcon />} {...otherProps}>
        {children ?? "Create activity"}
      </Button>
    </Menu.Target>
    <Menu.Dropdown>
      <Menu.Item
        icon={<ConvertIcon />}
        onClick={() => {
          openModal({
            title: "Convert event into activity",
            children: (
              <GoogleEvents
                onConvert={activity => {
                  closeAllModals();
                  onCreate(activity);
                }}
              />
            ),
          });
        }}
      >
        Turn an existing calendar event into an activity
      </Menu.Item>
      <Menu.Item
        icon={<AddIcon />}
        onClick={() => {
          openModal({
            title: "New activity",
            children: (
              <ActivityCreateForm
                onCreate={activity => {
                  closeAllModals();
                  onCreate(activity);
                }}
              />
            ),
          });
        }}
      >
        Create from scratch
      </Menu.Item>
    </Menu.Dropdown>
  </Menu>
);

export default ActivityCreateButton;
