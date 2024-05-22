import { Box, Drawer } from "@mui/material";
import { defaultSearchParams, updateSearchParams } from "features/searchParamsReducer";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AdvancedSearch } from "../AdvancedSearch";

export const AdvancedSearchDrawer = ({searchParams, advancedSearchOpen, setAdvancedSearchOpen}) => {

  const dispatch = useDispatch();

  // Keep a separate local state so we can decide when to submit it
  const [localSearchParams, setLocalSearchParams] = useState(defaultSearchParams);

  // sync changes to external search params with local state
  useEffect(() => {
    setLocalSearchParams(searchParams);
  }, [searchParams])

  // When search changes, update local state
  const onSearchChange = (values) => {
    setLocalSearchParams(values);
  }

  // When closed:
  // - close the drawer (obviously)
  // - update the external search params state
  const onAdvancedSearchClose = () => {
    setAdvancedSearchOpen(false);
    dispatch(updateSearchParams(localSearchParams));
  }

  return (
    <Drawer
      open={advancedSearchOpen}
      onClose={onAdvancedSearchClose}
    >
      <Box padding={1}>
        <AdvancedSearch
          search={localSearchParams}
          onSearchChange={onSearchChange}
          onSearchSubmit={onAdvancedSearchClose}
        />
      </Box>
    </Drawer>
  );
};