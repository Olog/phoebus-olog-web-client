import { useRef, useState, useEffect } from "react";
import { Box, Divider, styled, useTheme, useMediaQuery } from "@mui/material";
import { useParams } from "react-router-dom";
import LogDetailsContainer from "src/components/log/LogDetails/LogDetailsContainer";
import { SearchResults } from "components/search";
import { useCallback } from "react";

const ContentView = styled(Box, {
  shouldForwardProp: (prop) => prop !== "leftFlex" && prop !== "rightFlex"
})(({ theme, leftFlex, rightFlex }) => ({
  display: "grid",
  gridTemplateColumns: `minmax(0,0) minmax(150px, ${leftFlex}fr) minmax(0,4px) minmax(250px, ${rightFlex}fr)`,
  height: "100%",
  [theme.breakpoints.down("md")]: {
    display: "flex",
    flexDirection: "column-reverse",
    "& > *": { flex: 1, minWidth: 0 }
  }
}));

function SearchView() {
  const { id } = useParams();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [leftFlex, setLeftFlex] = useState(1.25);
  const rightFlex = 3.24 - leftFlex;

  const { onMouseMove, onMouseUp, containerRef, onMouseDown } =
    changeLayoutRatio(leftFlex, setLeftFlex);

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return isDesktop ? (
    <ContentView
      ref={containerRef}
      leftFlex={leftFlex}
      rightFlex={rightFlex}
    >
      <Divider sx={{ bgcolor: "#E2E8EE" }} />
      <SearchResults />
      <Divider
        onMouseDown={onMouseDown}
        sx={{ bgcolor: "#ffffffff", cursor: "col-resize" }}
      />
      <LogDetailsContainer id={id} />
    </ContentView>
  ) : (
    <ContentView
      leftFlex={leftFlex}
      rightFlex={rightFlex}
    >
      <Divider sx={{ borderColor: "#E2E8EE", orientation: "horizontal" }} />
      <SearchResults />
      <Divider sx={{ borderColor: "#E2E8EE", orientation: "horizontal" }} />
      <LogDetailsContainer id={id} />
    </ContentView>
  );
}

export default SearchView;

function changeLayoutRatio(leftFlex, setLeftFlex) {
  const containerRef = useRef(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startFlex = useRef(0);

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const onMouseMove = useCallback(
    (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - startX.current;
      const { width } = containerRef.current.getBoundingClientRect();
      const flexArea = width - 16;
      const deltaFlex = (dx / flexArea) * 4;
      setLeftFlex(clamp(startFlex.current + deltaFlex, 1, 3));
    },
    [setLeftFlex]
  );

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }, [onMouseMove]);

  const onMouseDown = useCallback(
    (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      dragging.current = true;
      startX.current = e.clientX;
      startFlex.current = leftFlex;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [leftFlex, onMouseMove, onMouseUp]
  );

  return { onMouseMove, onMouseUp, containerRef, onMouseDown };
}
