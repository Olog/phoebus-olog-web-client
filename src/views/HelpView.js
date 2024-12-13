import { Box } from "@mui/material";
import { Help } from "components/shared/Help";
import customization from "config/customization";
import React from "react";

export const HelpView = () => {
  const summary = `
    OLOG (Online Logbook Service) allows for the creation and retrieval of log entries.
    This service was developed to address the needs of operators, engineers, and users of large scientific facilities.
  `;

  return (
    <Box margin="0 auto" paddingX={4} maxWidth="800px">
      <Help
        summary={summary}
        docsHref={customization.DOCS_HREF}
        supportHref={customization.SUPPORT_HREF}
        version={customization.VERSION}
        versionHref={customization.VERSION_HREF}
      />
    </Box>
  );
};
