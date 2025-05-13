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

import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { InputAdornment, Link, OutlinedInput, styled } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import { updateAdvancedSearch } from "src/features/advancedSearchThunk";
import useSanitizedSearchParams, {
  withoutParams,
  withoutCacheBust
} from "hooks/useSanitizedSearchParams";
import { removeEmptyKeys } from "api/ologApi";
import customization from "config/customization";

const SearchBoxInput = styled(({ searchParams, showFilters, className }) => {
  const [searchString, setSearchString] = useState("");
  const dispatch = useDispatch();
  const { toSearchParams, toQueryString } = useSanitizedSearchParams();

  // On updates to the searchParams, update the text of
  // the search box to include those params, but don't
  // show any empty values ("tags=") or the cacheBust param
  useEffect(() => {
    if (searchParams) {
      setSearchString(
        toQueryString(
          removeEmptyKeys(withoutCacheBust(withoutParams(searchParams)))
        )
      );
    }
  }, [searchParams, toQueryString]);

  const onChange = (event) => {
    setSearchString(event.target.value);
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      const sanitizedSearchParams = toSearchParams(searchString);
      dispatch(updateAdvancedSearch(sanitizedSearchParams));
    }
  };

  return (
    <OutlinedInput
      id="search"
      disabled={showFilters}
      placeholder="No search string"
      value={searchString}
      onChange={(e) => onChange(e)}
      onKeyDown={onKeyDown}
      inputProps={{
        type: "search",
        "aria-label": "Search Logs"
      }}
      endAdornment={
        <InputAdornment position="end">
          <Link
            href={`${customization.APP_BASE_URL}/SearchHelp_en.html`}
            target="_blank"
            aria-label="Logbook Search Help Reference, opens in new tab"
            sx={{
              display: "flex",
              alignItems: "center"
            }}
          >
            <HelpIcon color="primary" />
          </Link>
        </InputAdornment>
      }
      className={className}
    />
  );
})({});

export default SearchBoxInput;
