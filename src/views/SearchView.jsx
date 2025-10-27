import { useRef, useState } from "react";
import { Box, Divider, styled, useTheme, useMediaQuery } from "@mui/material";
import { useParams } from "react-router-dom";
import { Resizable } from "re-resizable";
import LogDetailsContainer from "src/components/log/LogDetails/LogDetailsContainer";
import { SearchResults } from "components/search";

const ContentView = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100%",
  width: "100%",
  "& > *": {
    minWidth: 0
  },
  [theme.breakpoints.down("md")]: {
    flexDirection: "column-reverse",
    "& > *": {
      flex: 1,
      height: "50%",
      width: "100%"
    }
  }
}));

const SearchView = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const containerRef = useRef(null);
  const [leftPercent, setLeftPercent] = useState((1.25 / 3.25) * 100);

  if (isDesktop) {
    return (
      <ContentView ref={containerRef}>
        <Divider
          sx={{ borderColor: "#E2E8EE" }}
          orientation="vertical"
        />
        <Resizable
          size={{ width: `${leftPercent}%` }}
          minWidth="10%"
          maxWidth="80%"
          enable={{ right: true, left: false, top: false, bottom: false, topRight: false, bottomRight: false, topLeft: false, bottomLeft: false }}
          onResizeStop={(_e, _direction, ref) => {
            const container = containerRef.current;
            if (!container) {
              return;
            }
            const containerWidth = container.getBoundingClientRect().width;
            const newPercent = (ref.offsetWidth / containerWidth) * 100;
            const clamped = Math.min(Math.max(newPercent, 15), 80);
            setLeftPercent(clamped);
          }}
        >
          <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
            <SearchResults />
          </Box>
        </Resizable>
        <Divider
          sx={{ borderColor: "#E2E8EE" }}
          orientation="vertical"
        />
        <Box sx={{ flex: 1, minWidth: 0, overflow: "auto" }}>
          <LogDetailsContainer id={id} />
        </Box>
      </ContentView>
    );
  }

  return (
    <ContentView useRef={containerRef}>
      <Divider sx={{ borderColor: "#E2E8EE" }} />
      <Box sx={{ width: "100%", height: "50%", overflow: "auto" }}>
        <SearchResults />
      </Box>
      <Divider sx={{ borderColor: "#E2E8EE" }} />
      <Box sx={{ width: "100%", height: "50%", overflow: "auto" }}>
        <LogDetailsContainer id={id} />
      </Box>
    </ContentView>
  );
};

export default SearchView;
