import type { ImportsMap, PresetName } from "unplugin-auto-import/types";

export const imports: Array<ImportsMap | PresetName> = [
  "react",
  {
    "~/components": [
      "AppLayout",
      "AnchorContainer",
      "EmptyCard",
      "Head",
      "PageHeader",
      "Time",
    ],
    "~/components/icons": [
      "AddIcon",
      "AlertIcon",
      "CheckCircleIcon",
      "CreateIcon",
      "DeleteIcon",
      "DashboardIcon",
      "EditIcon",
      "OpenExternalIcon",
      "SaveIcon",
      "SearchIcon",
      "SettingsIcon",
      "UserIcon",
    ],
    "~/helpers/apollo/preloadedQuery": ["usePreloadedQuery"],
    "~/helpers/apollo/notifications": ["useApolloAlertCallback"],
    "~/helpers/errors": ["formatError"],
    "~/helpers/form": ["parseFormErrors", "showFormErrorsAlert"],
    "~/helpers/hooks": ["useMounted", "usePrevious"],
    "~/helpers/inertia/layout": ["buildLayout"],
    "~/helpers/inertia/page": ["usePage", "usePageErrors", "usePageProps"],
    "~/helpers/inertia/router": ["useRouter"],
    "~/helpers/json": ["formatJSON"],
    "~/helpers/luxon": ["useParseDateTime"],
    "~/helpers/meta": ["getMeta", "requireMeta"],
    "~/helpers/notifications": ["showNotice", "showAlert"],
    "~/helpers/resolve": [["default", "resolve"]],
    // "~/helpers/url": ["isUrl"],
    "@apollo/client": [
      "useApolloClient",
      "useQuery",
      "useLazyQuery",
      "useSubscription",
      "useMutation",
    ],
    "@fullstory/browser": [
      ["setVars", "setFSVars"],
      ["isInitialized", "isFSInitialized"],
    ],
    "@inertiajs/react": ["Link"],
    "@mantine/core": [
      "packSx",
      "rem",
      "useMantineTheme",
      "useMantineColorScheme",
      "Alert",
      "Anchor",
      "Badge",
      "Box",
      "Button",
      "Card",
      "Center",
      "Checkbox",
      "Chip",
      "Container",
      "Divider",
      "Flex",
      "Group",
      "List",
      "LoadingOverlay",
      "Menu",
      "MediaQuery",
      "Skeleton",
      "Space",
      "Stack",
      "Text",
      "Textarea",
      "TextInput",
      "Title",
      "Tooltip",
      "Transition",
    ],
    "@mantine/form": ["useForm"],
    "@mantine/hooks": [
      "useDebouncedValue",
      "useDidUpdate",
      "useElementSize",
      "useLogger",
      "useMediaQuery",
      "useViewportSize",
      "useWindowEvent",
    ],
    "@mantine/notifications": ["showNotification"],
    "@mantine/modals": ["openModal", "closeAllModals"],
    "lodash-es": [
      "first",
      "get",
      "isEmpty",
      "isEqual",
      "isNil",
      "isUndefined",
      "keyBy",
      "mapKeys",
      "mapValues",
      "omit",
      "omitBy",
      "pick",
      "take",
      "uniqBy",
    ],
    "is-url": [["default", "isUrl"]],
    luxon: ["DateTime", "Duration"],
    "tiny-invariant": [["default", "invariant"]],
  },
];
