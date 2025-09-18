import { Box, Stack, Typography } from "@mui/material";
import customization from "config/customization";
import { ExternalLink } from "src/components/shared/Link";

export const HelpView = () => {
  const { SUPPORT_HREF, VERSION } = customization;
  return (
    <Box
      margin="0 auto"
      maxWidth="800px"
    >
      <Stack gap={1}>
        <Box>
          <Typography
            variant="h3"
            my="1rem"
          >
            About
          </Typography>
          <Typography>
            OLOG (Online Logbook Service) allows for the creation and retrieval
            of log entries. This service was developed to address the needs of
            operators, engineers, and users of large scientific facilities.
          </Typography>
        </Box>
        {SUPPORT_HREF && (
          <Box>
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
                  href="https://olog.readthedocs.io/en/latest/"
                  label="Visit the documentation to learn more"
                >
                  Read the docs
                </ExternalLink>
              </Typography>
            </>
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
            {SUPPORT_HREF && (
              <>
                <Typography
                  display="flex"
                  gap={0.5}
                >
                  Experiencing issues or want to suggest an improvement?
                  <ExternalLink
                    href={SUPPORT_HREF}
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
            {VERSION ? (
              <ExternalLink
                ml={1}
                href={`https://github.com/Olog/phoebus-olog-web-client/tree/v${VERSION}`}
                label={`version ${VERSION}`}
              >
                {VERSION}
              </ExternalLink>
            ) : (
              VERSION
            )}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};
