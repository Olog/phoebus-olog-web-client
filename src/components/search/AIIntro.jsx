import {
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import { keyframes } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { SearchModeToggle } from "components/search/SearchModeToggle";
import { AIAnalysisSwitch } from "components/search/AIAnalysisSwitch";
import { SEARCH_MODES } from "features/searchModeReducer";

// soft pulsing glow to draw the eye to the demo controls
const pulse = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(0, 153, 220, 0.35); }
  70%  { box-shadow: 0 0 0 10px rgba(0, 153, 220, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 153, 220, 0); }
`;

const DemoBox = ({ children }) => (
  <Box
    sx={{
      display: "inline-flex",
      borderRadius: "8px",
      padding: "4px",
      pointerEvents: "none",
      animation: `${pulse} 2.5s ease-out infinite`
    }}
  >
    {children}
  </Box>
);

const ExampleQuestion = ({ children }) => (
  <Typography
    variant="body2"
    sx={{
      fontStyle: "italic",
      backgroundColor: "#f5f9fc",
      borderLeft: "3px solid #0099dc",
      borderRadius: "0 6px 6px 0",
      padding: "8px 12px",
      color: "#37474f"
    }}
  >
    {children}
  </Typography>
);

export const AIIntro = ({ onDismiss }) => {
  return (
      <Card
        variant="outlined"
        sx={{
          margin: 4,
          width: "100%",
          maxWidth: "720px",
          alignSelf: "flex-start",
          height: "fit-content",
          position: "relative",
          borderTop: "3px solid #0099dc",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)"
        }}
      >
        <IconButton
          aria-label="dismiss introduction"
          onClick={onDismiss}
          size="small"
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <CardContent sx={{ padding: "24px 28px" }}>
          <Stack gap={2.5}>
            <Stack
              flexDirection="row"
              alignItems="center"
              gap={1.5}
            >
              <Box
                sx={{
                  backgroundColor: "#e6f5fc",
                  borderRadius: "50%",
                  width: 70,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <AutoAwesomeIcon sx={{ color: "#0099dc" }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  lineHeight={1.2}
                >
                  Introducing Olog's AI Search
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Ask questions in plain language — no query syntax needed.
                </Typography>
              </Box>
            </Stack>

            <ExampleQuestion>
              “Show logs about what caused the fill pattern alarm, tagged as
              power supplies.”
            </ExampleQuestion>

            <Typography variant="body2">
              Filters still work here, so you can select the <strong>power supplies</strong> tag in the
              filter panel, then simply ask —
            </Typography>

            <ExampleQuestion>“What caused the fill pattern alarm?”</ExampleQuestion>

            <Divider />

            <Stack gap={1}>
              <Typography variant="body2">
                Turn on{" "}
                <strong>Analysis</strong> for insights on the logs found
              </Typography>
              <DemoBox>
                <AIAnalysisSwitch
                  enabled
                  onToggle={() => {}}
                />
              </DemoBox>
            </Stack>

            <Stack gap={1}>
              <Typography variant="body2">
                Switch back to classic query search any time with the toggle
                under the search bar:
              </Typography>
              <DemoBox>
                <SearchModeToggle
                  mode={SEARCH_MODES.AI}
                  onChange={() => {}}
                />
              </DemoBox>
            </Stack>

            <Alert
              severity="info"
              sx={{ padding: "2px 12px", "& .MuiAlert-message": { fontSize: "0.82rem" } }}
            >
              Dates and times inside questions aren’t understood yet — use the
              Start&nbsp;Time and End&nbsp;Time filters instead.
            </Alert>
          </Stack>
        </CardContent>
      </Card>
  );
};