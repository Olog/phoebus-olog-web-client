import { Box, Divider, styled } from "@mui/material";
import { useParams } from "react-router-dom";
import LogDetailsContainer from "beta/components/log/LogDetails/LogDetailsContainer";
import { SearchResults } from "beta/components/search";

const SearchView = styled(({ className }) => {
  const { id } = useParams();

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1.15fr auto 2fr",
        gridTemplateRows: "1fr"
      }}
      className={`SearchView ${className}`}
    >
      <SearchResults />
      <Divider
        sx={{ borderColor: "#E2E8EE" }}
        orientation="vertical"
      />
      <LogDetailsContainer id={id} />
    </Box>
  );
})({
  "& > *": {
    minWidth: 0
  },
  "& .SearchResultList": {
    flex: 1,
    minHeight: 0
  },
  "& .LogDetailsContainer": {
    flex: 2
  }
});

export default SearchView;
