import { styled } from "@mui/material";

const StyledAnchor = styled("a")(({ theme }) => ({
  left: "-150%",
  position: "absolute",
  fontSize: "1.5rem",
  backgroundColor: theme.palette.grey[300],
  padding: "0.5rem 1rem",
  zIndex: 999,
  textDecoration: "underline",

  transition: "all 300ms linear",

  "&:focus": {
    left: 0
  }
}));

const SkipToContent = ({ children, ...props }) => {
  return (
    <StyledAnchor
      tabIndex={0}
      {...props}
    >
      {children}
    </StyledAnchor>
  );
};

export default SkipToContent;
