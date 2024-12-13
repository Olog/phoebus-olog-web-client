import { Box, Stack, Typography, styled } from "@mui/material";
import React from "react";
import { ExternalLink } from "./Link";

export const Help = styled(
  ({ summary, docsHref, supportHref, version, versionHref, className }) => {
    return (
      <Stack className={className} gap={1}>
        <Box>
          <Typography variant="h3" my="1rem">
            About
          </Typography>
          {typeof summary === "string" ? (
            <Typography>{summary}</Typography>
          ) : (
            summary
          )}
        </Box>
        {supportHref || docsHref ? (
          <Box>
            {docsHref ? (
              <>
                <Typography variant="h3" my="1rem">
                  Support
                </Typography>
                <Typography display="flex" gap={0.5}>
                  Want more information about this app?
                  <ExternalLink
                    href={docsHref}
                    label="Visit the documentation to learn more"
                  >
                    Read the docs
                  </ExternalLink>
                </Typography>
              </>
            ) : null}
            {supportHref ? (
              <>
                <Typography display="flex" gap={0.5}>
                  Experiencing issues or want to suggest an improvement?
                  <ExternalLink
                    href={supportHref}
                    label="Report an issue or improvement with the support desk"
                  >
                    Contact support
                  </ExternalLink>
                </Typography>
              </>
            ) : null}
          </Box>
        ) : null}

        <Box mt="1rem">
          <Typography fontWeight="bold" display="flex">
            Version: {""}
            {versionHref ? (
              <ExternalLink href={versionHref} label={`version ${version}`}>
                {version}
              </ExternalLink>
            ) : (
              version
            )}
          </Typography>
        </Box>
      </Stack>
    );
  }
)({});
