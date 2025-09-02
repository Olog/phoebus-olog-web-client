import { Box, Stack, Typography, styled } from "@mui/material";
import { ExternalLink } from "./Link";
import customization from "src/config/customization";

export const Help = styled(({ docsHref, supportHref, version, className }) => {
  return (
    <Stack
      className={className}
      gap={1}
    >
      <Box>
        <Typography
          variant="h3"
          my="1rem"
        >
          About
        </Typography>
        <Typography>
          OLOG (Online Logbook Service) allows for the creation and retrieval of
          log entries. This service was developed to address the needs of
          operators, engineers, and users of large scientific facilities.
        </Typography>
      </Box>
      {(supportHref || docsHref) && (
        <Box>
          {docsHref && (
            <>
              <Typography
                variant="h3"
                my="1rem"
              >
                Support
              </Typography>
              <Typography
                display="flex"
                gap={0.5}
              >
                Want more information about this app?
                <ExternalLink
                  href={docsHref}
                  label="Visit the documentation to learn more"
                >
                  Read the docs
                </ExternalLink>
              </Typography>
            </>
          )}
          <Typography
            display="flex"
            gap={0.5}
          >
            Want more information about how the search functionality works?
            <ExternalLink
              href={`${customization.APP_BASE_URL}/SearchHelp_en.html`}
              target="_blank"
              label="Visit the documentation to learn more"
            >
              Read the docs
            </ExternalLink>
          </Typography>
          {supportHref && (
            <>
              <Typography
                display="flex"
                gap={0.5}
              >
                Experiencing issues or want to suggest an improvement?
                <ExternalLink
                  href={supportHref}
                  label="Report an issue or improvement with the support desk"
                >
                  Contact support
                </ExternalLink>
              </Typography>
            </>
          )}
        </Box>
      )}

      <Box mt="1rem">
        <Typography
          fontWeight="bold"
          display="flex"
        >
          Version:{" "}
          {version ? (
            <ExternalLink
              ml={1}
              href={`https://github.com/Olog/phoebus-olog-web-client/tree/v${version}`}
              label={`version ${version}`}
            >
              {version}
            </ExternalLink>
          ) : (
            version
          )}
        </Typography>
      </Box>
    </Stack>
  );
})({});
