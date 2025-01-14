import React, { useState } from "react";
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  styled,
} from "@mui/material";
import { element, object, string } from "prop-types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { theme } from "config/theme";
import { ExternalButtonLink, InternalButtonLink } from "components/shared/Link";

const propTypes = {
  /** String describing the most important informatio about the error */
  title: string,
  /** String describing supporting information about the error */
  subtitle: string,
  /** Additional details about the error message, such as a stacktrace if relevant */
  details: string,
  /** Secondary action component that is rendered instead of the "Go home" navigation link */
  SecondaryActionComponent: element,
  /** URL to application support, should the user wish to contact the support desk */
  supportHref: string,
  /** Additional props for the title typography; e.g. to override the variant or component */
  titleProps: object,
  /** Additional props for the subtitle typography; e.g. to override the variant or component */
  subtitleProps: object,
};

const ErrorPage = styled(
  ({
    title,
    subtitle,
    details,
    SecondaryActionComponent,
    supportHref,
    homeHref = "/",
    titleProps,
    subtitleProps,
    className,
  }) => {
    const [showDetails, setShowDetails] = useState(false);
    const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

    const toggleDetails = () => {
      setShowDetails(!showDetails);
    };

    return (
      <>
        <Box
          className={className}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
        >
          <Typography variant="h3" {...subtitleProps}>
            {subtitle}
          </Typography>
          <Typography variant="h2" {...titleProps}>
            {title}
          </Typography>
          {details ? (
            <Accordion
              expanded={showDetails}
              onChange={toggleDetails}
              sx={{ maxWidth: isDesktop ? "50%" : "100%" }}
            >
              <AccordionSummary
                id="error-details-header"
                aria-controls="error-details-content"
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography variant="body1">
                  {showDetails ? "Hide Details" : "Show Details"}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  whiteSpace: "pre",
                  overflow: "scroll",
                }}
              >
                <Typography variant="body2" fontFamily="monospace">
                  {details}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ) : null}
          <Box display="flex" justifyContent="center" gap={2}>
            {SecondaryActionComponent ?? (
              <InternalButtonLink variant="contained" to={homeHref}>
                Return to Home
              </InternalButtonLink>
            )}

            {supportHref ? (
              <ExternalButtonLink
                href={supportHref}
                text="Contact Support"
                variant="outlined"
              />
            ) : null}
          </Box>
        </Box>
      </>
    );
  }
)({});
ErrorPage.propTypes = propTypes;

export default ErrorPage;
