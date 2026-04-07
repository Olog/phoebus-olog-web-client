import { useRef, useState, useLayoutEffect } from "react";
import { Chip, Stack, Tooltip } from "@mui/material";
import { LogbookChip } from "src/components/log/LogbookChip";
import { TagChip } from "src/components/log/TagChip";
import { EntryTypeChip } from "src/components/log/EntryTypeChip";

const chipSx = { fontSize: ".65rem", height: "20px" };

export const EntryPillList = ({
  logbooks = [],
  tags = [],
  level,
  showLevel,
  sx
}) => {
  const outerRef = useRef(null);
  const measureRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(null);

  const pills = [
    ...logbooks.map((lb) => (
      <LogbookChip
        key={`lb-${lb.name}`}
        value={lb.name}
        sx={chipSx}
      />
    )),
    ...tags.map((t) => (
      <TagChip
        key={`tag-${t.name}`}
        value={t.name}
        sx={chipSx}
        iconProps={{ width: "12px" }}
      />
    )),
    ...(showLevel && level
      ? [
          <EntryTypeChip
            key="level"
            value={level}
            sx={chipSx}
          />
        ]
      : [])
  ];

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const measure = measureRef.current;
    if (!outer || !measure || pills.length === 0) {
      return;
    }

    const recalculate = () => {
      const pillEls = [...measure.children];
      const firstOverflowIndex = pillEls.findIndex((el) => el.offsetTop > 0);
      if (firstOverflowIndex === -1) {
        setVisibleCount(null);
      } else {
        setVisibleCount(Math.max(0, firstOverflowIndex - 1));
      }
    };

    const ro = new ResizeObserver(recalculate);
    ro.observe(outer);
    recalculate();
    return () => ro.disconnect();
  }, [pills.length]);

  const visible = visibleCount !== null ? pills.slice(0, visibleCount) : pills;
  const hidden = visibleCount !== null ? pills.slice(visibleCount) : [];

  return (
    <Stack
      position="relative"
      ref={outerRef}
      sx={{ mt: 0.5, mb: 0.5, "& > div > div": { cursor: "pointer" }, ...sx }}
    >
      <Stack
        ref={measureRef}
        flexDirection="row"
        gap={0.5}
        flexWrap="wrap"
        sx={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          top: 0,
          left: 0,
          right: 0
        }}
      >
        {pills}
      </Stack>

      <Stack
        flexDirection="row"
        gap={0.5}
        flexWrap="nowrap"
        overflow="hidden"
        alignItems="center"
      >
        {visible}
        {hidden.length > 0 && (
          <Tooltip
            title={
              <Stack
                flexDirection="row"
                flexWrap="wrap"
                gap={0.5}
                p={0.5}
              >
                {hidden}
              </Stack>
            }
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "white",
                  color: "text.primary",
                  boxShadow: 3,
                  "& .MuiTooltip-arrow": { color: "white" }
                }
              }
            }}
          >
            <Chip
              label={`+${hidden.length} more`}
              size="small"
              variant="outlined"
              sx={{
                flexShrink: 0,
                fontSize: ".65rem",
                height: "20px",
                cursor: "default"
              }}
            />
          </Tooltip>
        )}
      </Stack>
    </Stack>
  );
};
