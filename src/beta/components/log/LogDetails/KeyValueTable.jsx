import React from "react";
import { Box, Typography } from "@mui/material";

export const KeyValueTable = ({ data }) => (
  <Box sx={{
    width: "fit-content",
    display: "grid",
    gridTemplateColumns: `auto auto`,
    columnGap: 0.5,
    rowGap: 0
  }}>
    {data.map(({ name, value }, i) => (
      <React.Fragment key={`${name}-${i}`}>
        <Typography sx={{ gridColumn: "1" }} fontSize="0.95rem" fontWeight="bold">{name}</Typography>
        <Typography sx={{ gridColumn: "2" }} fontSize="0.95rem" ml={1}>{value}</Typography>
      </React.Fragment>
    ))}
  </Box>
);

