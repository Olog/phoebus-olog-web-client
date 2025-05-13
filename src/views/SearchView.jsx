import { Box, Divider, styled } from "@mui/material";
import { useParams } from "react-router-dom";
import LogDetailsContainer from "src/components/log/LogDetails/LogDetailsContainer";
import { SearchResults } from "components/search";

const ContentView = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "auto 1.25fr auto 2fr",
  gridTemplateRows: "1fr",
  height: "100%",
  [theme.breakpoints.down("md")]: {
    display: "flex",
    flexDirection: "column-reverse",
    height: "100%",
    width: "auto",
    minWidth: 0,
    "& > div": {
      flex: 1
    },
    "& > hr": {
      height: "auto",
      minHeight: "auto"
    }
  }
}));

const SearchView = styled(({ className }) => {
  const { id } = useParams();

  return (
    <Box height="100%">
      <ContentView className={`SearchView ${className}`}>
        <Divider
          sx={{ borderColor: "#E2E8EE" }}
          orientation="vertical"
        />
        <SearchResults />
        <Divider
          sx={{ borderColor: "#E2E8EE" }}
          orientation="vertical"
        />
        <LogDetailsContainer id={id} />
      </ContentView>
    </Box>
  );
})({
  "& > *": {
    minWidth: 0
  }
});

export default SearchView;
