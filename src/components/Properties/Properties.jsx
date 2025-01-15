/**
 * Copyright (C) 2019 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */
import { Box, Stack, Typography, styled } from "@mui/material";
import Collapse from "components/shared/Collapse";

const StyledCollapse = styled(Collapse)({
  paddingLeft: 10
});

const Properties = ({ property }) => {
  const renderedProperties = property.attributes.map((a, index) => (
    <Stack
      flexDirection="row"
      gap={1}
      key={index}
    >
      <Typography
        fontWeight="bold"
        textAlign="right"
      >
        {a.name}:
      </Typography>
      <Typography fontStyle="italic">{a.value}</Typography>
    </Stack>
  ));

  return (
    <StyledCollapse
      active
      title={property.name}
    >
      <Box
        sx={{
          "& > *:nth-child(2n)": {
            backgroundColor: (theme) => theme.palette.grey[300]
          }
        }}
      >
        {renderedProperties}
      </Box>
    </StyledCollapse>
  );
};

export default Properties;
