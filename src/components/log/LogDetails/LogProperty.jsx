import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  styled
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { KeyValueTable } from "./KeyValueTable";

const AccordionSummaryStyles = {
  "& > .MuiAccordionSummary-content": {
    margin: "6px 0"
  },
  "& > .MuiAccordionSummary-content.Mui-expanded": {
    margin: "20px 0 5px"
  }
};

const LogProperty = styled(({ property, className }) => {
  const attributes = property?.attributes?.filter(
    (it) => it.state.toLowerCase() === "active"
  );

  return (
    <Accordion
      variant="outlined"
      className={className}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${property.name}-content`}
        id={`${property.name}-header`}
        sx={AccordionSummaryStyles}
      >
        <Typography
          variant="button"
          fontSize=".8rem"
        >
          {property.name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <KeyValueTable data={attributes} />
      </AccordionDetails>
    </Accordion>
  );
})(({ theme }) => ({
  padding: 2,
  border: 0,
  backgroundColor: `${theme.palette.primary.main}10`,
  borderLeft: `${theme.palette.primary.main} solid 5px`,
  borderRadius: 4,
  transition: "height .2s ease-in-out",
  height: "38px",
  "&.Mui-expanded": {
    margin: 0,
    height: "100%"
  },
  "& > .MuiButtonBase-root, .MuiButtonBase-root.Mui-expanded": {
    minHeight: "auto"
  },
  // Get rid of the small line above the accordion
  "&:before": {
    display: "none"
  }
}));

export default LogProperty;
