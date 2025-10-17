import { useEffect, useState } from "react";
import { Alert, Button, Tooltip, styled, tooltipClasses } from "@mui/material";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";

const StyledTooltip = styled(({ className, ...props }) => {
  return (
    <Tooltip
      {...props}
      classes={{ popper: className }}
    />
  );
})(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "transparent"
  }
}));

const CopyUrlButton = ({ url }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => {
        setOpen(false);
      }, [1500]);

      return () => {
        clearTimeout(id);
      };
    }
  }, [open]);

  const onClick = () => {
    navigator.clipboard.writeText(url);
    setOpen(true);
  };

  return (
    <StyledTooltip
      title={
        <Alert
          severity="success"
          variant="standard"
          sx={{
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "success.light",
            fontSize: "0.75rem",
            padding: "5px 10px",
            "& .MuiAlert-icon": {
              fontSize: "1.2rem",
              marginRight: "10px"
            }
          }}
        >
          URL copied!
        </Alert>
      }
      open={open}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      PopperProps={{
        disablePortal: true
      }}
    >
      <Button
        startIcon={
          <ContentCopyOutlined sx={{ width: "12px", marginBottom: "2px" }} />
        }
        onClick={onClick}
        sx={{ fontSize: ".8rem" }}
      >
        Copy
      </Button>
    </StyledTooltip>
  );
};

export default CopyUrlButton;
