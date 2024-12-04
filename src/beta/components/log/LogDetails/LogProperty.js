import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { KeyValueTable } from "./KeyValueTable";

const AccordionSummaryStyles = {
  "& > .MuiAccordionSummary-content": {
    margin: "10px 0",
  },
  "& > .MuiAccordionSummary-content.Mui-expanded": {
    margin: "20px 0 5px",
  },
};

const LogProperty = styled(({ property, className }) => {
  const attributes = property?.attributes?.filter(
    (it) => it.state.toLowerCase() === "active"
  );

  return (
    <Accordion variant="outlined" className={className}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${property.name}-content`}
        id={`${property.name}-header`}
        sx={AccordionSummaryStyles}
      >
        <Typography variant="button">{property.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <KeyValueTable data={attributes} />
      </AccordionDetails>
    </Accordion>
  );
})(({ theme }) => ({
  padding: 2,
  marginBottom: 8,
  border: 0,
  backgroundColor: `${theme.palette.primary.main}10`,
  borderLeft: `${theme.palette.primary.main} solid 5px`,
  "& > .MuiButtonBase-root, .MuiButtonBase-root.Mui-expanded": {
    minHeight: "auto",
  },
  // Get rid of the small line above the accordion
  "&:before": {
    display: "none",
  },
}));

export default LogProperty;
