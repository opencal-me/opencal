import type { FC } from "react";
import { Code, Image, Text } from "@mantine/core";
import type { ButtonProps } from "@mantine/core";

// import ConvertIcon from "~icons/heroicons/arrows-right-left-20-solid";
// import ChevronIcon from "~icons/heroicons/chevron-down-20-solid";

// import type { ActivityCreateButtonActivityFragment } from "~/helpers/graphql";

// import GoogleEvents from "./GoogleEvents";
// import ActivityCreateForm from "./ActivityCreateForm";

import createFromCalendarImageSrc from "~/assets/images/create-from-calendar.gif";

export type ActivityCreateButtonProps = Omit<
  ButtonProps,
  "loading" | "onClick"
> & {
  // readonly onCreate: (activity: ActivityCreateButtonActivityFragment) => void;
};

const ActivityCreateButton: FC<ActivityCreateButtonProps> = ({
  // onCreate,
  children,
  ...otherProps
}) => (
  <Button
    leftIcon={<AddIcon />}
    onClick={() => {
      openModal({
        title: "Create activity",
        children: (
          <Stack>
            <Stack>
              <Text size="sm" color="dimmed" lh={1.3}>
                To create an OpenCal activity, open your calendar and create an
                event with <Code>[open]</Code> in the title.
              </Text>
              <Image
                src={createFromCalendarImageSrc}
                width={375}
                radius="md"
                sx={{ alignSelf: "center" }}
              />
              <Text size="sm" color="dimmed" lh={1.3}>
                When you&apos;re done, it&apos;ll show up here & you&apos;ll get
                an email about it :)
              </Text>
              <Button
                component="a"
                href="https://calendar.google.com/calendar/r/eventedit"
                target="_blank"
                rel="noopener noreferrer nofollow"
                leftIcon={<OpenExternalIcon />}
              >
                Try it in Google Calendar
              </Button>
            </Stack>
          </Stack>
        ),
      });
    }}
    {...otherProps}
  >
    {children ?? "Create activity"}
  </Button>
  // <Menu
  //   withArrow
  //   position="bottom-start"
  //   styles={({ fn }) => ({
  //     itemIcon: {
  //       color: fn.primaryColor(),
  //     },
  //   })}
  // >
  //   <Menu.Target>
  //     <Button leftIcon={<ChevronIcon />} {...otherProps}>
  //       {children ?? "Create activity"}
  //     </Button>
  //   </Menu.Target>
  //   <Menu.Dropdown>
  //     <Menu.Item
  //       icon={<ConvertIcon />}
  //       onClick={() => {
  //         openModal({
  //           title: (
  //             <>
  //               <Text span>Create activity from existing event</Text>
  //               <Text size="sm" weight={400} color="dimmed" lh={1.3}>
  //                 Select an event from your calendar to convert into an
  //                 activity.
  //               </Text>
  //             </>
  //           ),
  //           children: (
  //             <GoogleEvents
  //               onConvert={activity => {
  //                 closeAllModals();
  //                 onCreate(activity);
  //               }}
  //               onVisit={() => {
  //                 closeAllModals();
  //               }}
  //             />
  //           ),
  //         });
  //       }}
  //     >
  //       Turn an existing calendar event into an activity
  //     </Menu.Item>
  //     <Menu.Item
  //       icon={<AddIcon />}
  //       onClick={() => {
  //         openModal({
  //           title: "New activity",
  //           children: (
  //             <ActivityCreateForm
  //               onCreate={activity => {
  //                 closeAllModals();
  //                 onCreate(activity);
  //               }}
  //             />
  //           ),
  //         });
  //       }}
  //     >
  //       Create from scratch
  //     </Menu.Item>
  //   </Menu.Dropdown>
  // </Menu>
);

export default ActivityCreateButton;
