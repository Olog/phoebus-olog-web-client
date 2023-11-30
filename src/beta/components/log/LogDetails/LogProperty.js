import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Typography, styled } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MetadataTable from "./MetadataTable";



const LogProperty = styled(({property, className}) => {

    const data = property?.attributes
        ?.filter(it => it.state.toLowerCase() === "active")
        ?.reduce((obj, curr) => {
            return {...obj, [curr.name]: curr.value}
        }, {});

    return (
       <Accordion 
            defaultExpanded
            variant="outlined"
            className={className}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${property.name}-content`}
                id={`${property.name}-header`}
            >
                <Typography variant="button">{property.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <MetadataTable data={data} />
            </AccordionDetails>
       </Accordion>
    );
})(({theme}) => ({

    padding: 2,
    margin: "0 !important",
    border: 0,
    backgroundColor: `${theme.palette.primary.main}10`,
    borderLeft: `${theme.palette.primary.main} solid 5px`,
    
    // Get rid of the small line above the accordion
    "&:before": {
        display: "none",
    }
}))

export default LogProperty;