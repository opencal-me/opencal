import type {
  CSSObject,
  DefaultMantineColor,
  MantineThemeOverride,
} from "@mantine/core";

import { DEFAULT_THEME } from "@mantine/core";
import type { Tuple } from "@mantine/core";

export type CustomColor = "brand";

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<DefaultMantineColor | CustomColor, Tuple<string, 10>>;
  }
}

export const APP_THEME: MantineThemeOverride = {
  colors: {
    brand: DEFAULT_THEME.colors.cyan,
  },
  primaryColor: "brand",
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, " +
    "Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
  fontFamilyMonospace:
    "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, " +
    "Liberation Mono, Courier New, monospace",
  focusRingStyles: {
    styles: ({ colors, colorScheme, primaryColor }) => ({
      outlineOffset: 2,
      outlineStyle: "solid",
      outlineWidth: 1,
      outlineColor: colors[primaryColor]![colorScheme === "dark" ? 7 : 5],
    }),
  },
  components: {
    Alert: {
      styles: {
        title: {
          textTransform: "lowercase",
        },
      },
    },
    Badge: {
      styles: {
        inner: {
          textTransform: "lowercase",
        },
      },
    },
    Button: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        inner: {
          textTransform: "lowercase",
        },
      },
    },
    Card: {
      defaultProps: {
        radius: "md",
      },
    },
    Checkbox: {
      styles: {
        label: {
          textTransform: "lowercase",
        },
      },
    },
    Input: {
      defaultProps: {
        radius: "md",
      },
    },
    InputWrapper: {
      styles: {
        label: {
          textTransform: "lowercase",
        },
      },
    },
    LoadingOverlay: {
      defaultProps: {
        loaderProps: {
          size: "sm",
        },
      },
    },
    Menu: {
      styles: {
        itemLabel: {
          textTransform: "lowercase",
        },
      },
    },
    Modal: {
      styles: ({ headings: { sizes, ...style } }) => ({
        title: {
          ...(sizes.h3 as CSSObject),
          ...(style as CSSObject),
        },
      }),
    },
    Text: {
      styles: {
        root: {
          textTransform: "lowercase",
        },
      },
    },
    ThemeIcon: {
      defaultProps: {
        variant: "default",
      },
    },
    Tooltip: {
      styles: {
        tooltip: {
          textTransform: "lowercase",
        },
      },
    },
  },
};

export const EMAIL_THEME: MantineThemeOverride = {
  ...APP_THEME,
  colorScheme: "light",
  globalStyles: ({ white }) => ({
    body: {
      margin: 8,
      fontSize: 14,
      backgroundColor: white,
    },
  }),
};
