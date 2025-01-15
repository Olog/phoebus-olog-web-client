import { Box, styled } from "@mui/material";
import { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const Header = styled("button")(({ theme }) => ({
  border: "none",
  width: "100%",
  display: "flex",
  flexDirection: "row",
  gap: 1,
  alignItems: "center",
  backgroundColor: theme.palette.grey[300],
  borderBottom: `1px solid ${theme.palette.grey[600]}`,

  "&:hover": {
    cursor: "pointer"
  }
}));

const Collapse = styled(({ title, active = false, className, children }) => {
  const [show, setShow] = useState(active);

  const handleClick = () => {
    setShow(!show);
  };

  return (
    <Box
      className={className}
      paddingY={1}
    >
      <Header
        onClick={handleClick}
        aria-expanded={show}
      >
        <ChevronRightIcon
          sx={{
            transition: "all 100ms",
            ariaHidden: "true",
            transform: show ? "rotate(90deg)" : ""
          }}
        />
        {title}
      </Header>
      {show ? <Box>{children}</Box> : null}
    </Box>
  );
})({});

export default Collapse;
