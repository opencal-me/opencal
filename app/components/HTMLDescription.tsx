import type { FC } from "react";

import { TypographyStylesProvider } from "@mantine/core";
import type { TypographyStylesProviderProps } from "@mantine/core";

export type HTMLDescriptionProps = Omit<
  TypographyStylesProviderProps,
  "children"
> & {
  readonly children: string;
};

const HTMLDescription: FC<HTMLDescriptionProps> = ({
  children,
  sx,
  ...otherProps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showFade, setShowFade] = useState(false);
  useEffect(() => {
    const containerEl = containerRef.current;
    const contentEl = contentRef.current;
    if (
      containerEl &&
      contentEl &&
      contentEl.clientHeight > containerEl.clientHeight
    ) {
      setShowFade(true);
    }
  }, []);

  return (
    <Box
      ref={containerRef}
      pos="relative"
      sx={[...packSx(sx), { overflow: "hidden" }]}
      {...otherProps}
    >
      <TypographyStylesProvider
        sx={({ fontSizes, colors }) => ({
          color: colors.dark[3],
          fontSize: fontSizes.sm,
          p: {
            marginBottom: rem(2),
          },
        })}
      >
        <div ref={contentRef} dangerouslySetInnerHTML={{ __html: children }} />
      </TypographyStylesProvider>
      {showFade && (
        <Box
          pos="absolute"
          bottom={0}
          left={0}
          right={0}
          h={60}
          sx={({ white, fn }) => ({
            background: fn.linearGradient(0, white, "transparent"),
          })}
        />
      )}
    </Box>
  );
};

export default HTMLDescription;
