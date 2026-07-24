import { FormControlLabel, Switch, Tooltip } from "@mui/material";

export const AIAnalysisSwitch = ({ enabled, onToggle }) => (
  <Tooltip title={enabled ? "Results + AI analysis" : "Results only"}>
    <FormControlLabel
      control={
        <Switch
          size="small"
          checked={enabled}
          onChange={onToggle}
          inputProps={{ "aria-label": "toggle ai analysis" }}
        />
      }
      label="Analysis"
      sx={{
        marginLeft: 0,
        marginRight: 0,
        whiteSpace: "nowrap",
        "& .MuiFormControlLabel-label": { fontSize: "0.8rem" }
      }}
    />
  </Tooltip>
);