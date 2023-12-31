import type { FC } from "react";
import { useNetwork } from "@mantine/hooks";
import CodeIcon from "~icons/heroicons/code-bracket-20-solid";

import { DefaultMantineColor, HoverCard, Image, Text } from "@mantine/core";
import type { BoxProps } from "@mantine/core";

import { ActivityStatusBadgeSubscriptionDocument } from "~/helpers/graphql";

import heartSrc from "~/assets/images/heart.png";

export type ActivityStatusBadgeProps = Omit<BoxProps, "children">;

const ActivityStatusBadge: FC<ActivityStatusBadgeProps> = ({
  ...otherProps
}) => {
  const { online } = useNetwork();

  // == Query
  const { data } = useSubscription(ActivityStatusBadgeSubscriptionDocument, {
    variables: {},
    onError: error => {
      console.error(
        "Failed to subscribe to activity status updates",
        formatJSON({ error }),
      );
    },
  });
  const { activityStatus } = data ?? {};
  const showStatus = !!activityStatus || !online;

  // == Status Text
  const [statusText, setStatusText] = useState(activityStatus || "");
  useEffect(() => {
    if (!online) {
      setStatusText("Offline");
    } else if (activityStatus) {
      setStatusText(activityStatus);
    }
  }, [activityStatus, online]);

  // == Tagline
  const [showTagline, setShowTagline] = useState(!showStatus);

  // == Markup
  return (
    <Box {...otherProps}>
      <Transition
        transition="slide-up"
        mounted={showStatus}
        onEnter={() => setShowTagline(false)}
        onExited={() => setShowTagline(true)}
      >
        {style => {
          const color: DefaultMantineColor = online ? "orange" : "red";
          return (
            <Center h="100%" {...{ style }}>
              <Badge
                size="xs"
                variant="dot"
                sx={({ colors, fn }) => ({
                  borderColor: fn.darken(colors[color]![4], 0.3),
                })}
                {...{ color }}
              >
                {statusText}
              </Badge>
            </Center>
          );
        }}
      </Transition>
      <Transition transition="slide-up" mounted={showTagline}>
        {style => (
          <Center h="100%" {...{ style }}>
            <HoverCard withArrow withinPortal>
              <HoverCard.Target>
                <Group spacing={4}>
                  <Text size="xs" weight={500} color="gray.6">
                    made by{" "}
                    <Anchor
                      href="https://twitter.com/scottific"
                      target="_blank"
                      weight={600}
                    >
                      scott
                    </Anchor>{" "}
                    &{" "}
                    <Anchor href="https://twitter.com/hulloitskai" weight={600}>
                      kai
                    </Anchor>{" "}
                    with
                  </Text>
                  <Image src={heartSrc} width={12} height={12} />
                </Group>
              </HoverCard.Target>
              <HoverCard.Dropdown
                sx={({ radius }) => ({ borderRadius: radius.md })}
              >
                <Stack spacing={6} align="center">
                  <Text size="sm" lh={1.4}>
                    Did you know OpenCal is{" "}
                    <Text span inherit weight={600}>
                      open source
                    </Text>
                    ?
                  </Text>
                  <Button
                    component="a"
                    href="https://github.com/opencal-me/opencal"
                    target="_blank"
                    compact
                    size="xs"
                    leftIcon={<CodeIcon />}
                    h="unset"
                    py={4}
                  >
                    take me to the code!
                  </Button>
                </Stack>
              </HoverCard.Dropdown>
            </HoverCard>
          </Center>
        )}
      </Transition>
    </Box>
  );
};

export default ActivityStatusBadge;
