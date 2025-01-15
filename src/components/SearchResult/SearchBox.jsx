/**
 * Copyright (C) 2020 European Spallation Source ERIC.
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

import { Button, Stack, Typography } from "@mui/material";
import SearchBoxInput from "../shared/input/managed/SearchBoxInput";

const SearchBox = ({
  searchParams,
  showFilters,
  setShowFilters,
  className
}) => {
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Stack
      gap={0.5}
      padding={1}
      className={className}
    >
      <SearchBoxInput {...{ searchParams, showFilters, isFetching: true }} />
      <Typography
        component={Button}
        onClick={(e) => toggleFilters(e)}
        aria-expanded={showFilters}
        variant="text"
        disableRipple
        fullWidth={false}
        maxWidth="max-content"
        padding={0}
        marginLeft="auto"
        fontStyle="italic"
        sx={{
          "&:hover, &": {
            background: "none",
            border: "none",
            boxShadow: "none"
          }
        }}
      >
        {showFilters ? "Hide Advanced Search" : "Show Advanced Search"}
      </Typography>
    </Stack>
  );
};

export default SearchBox;
