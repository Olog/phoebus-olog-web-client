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

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  IconButton,
  List,
  ListItem,
  Divider,
  Badge,
  Box
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import HomeIcon from "@mui/icons-material/Home";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import { useDispatch } from "react-redux";
import UserMenu from "./UserMenu";
import Initialize from "components/Initialize";
import { InternalButtonLink } from "components/shared/Link";
import { useShowLogin, useUser } from "features/authSlice";
import LoginDialog from "components/LoginLogout/LoginDialog";
import LogoutDialog from "components/LoginLogout/LogoutDialog";
import { useAdvancedSearch } from "features/advancedSearchReducer";
import SimpleSearch from "beta/components/search/SimpleSearch";
import { SortToggleButton } from "beta/components/search/SortToggleButton";
import { AdvancedSearchDrawer } from "beta/components/search/AdvancedSearchDrawer";
import {
  defaultSearchParams,
  updateSearchParams,
  useSearchParams
} from "features/searchParamsReducer";
import {
  updateSearchPageParams,
  useSearchPageParams
} from "features/searchPageParamsReducer";

const showSearchBoxRegex = /^\/$|^\/beta$|^\/beta\/logs$|^\/beta\/logs\/\d+$/;

const AppNavBar = () => {
  const user = useUser();
  const location = useLocation();
  const { pathname } = location;
  const { setShowLogin } = useShowLogin();
  const { active: advancedSearchActive, fieldCount: advancedSearchFieldCount } =
    useAdvancedSearch();
  const searchParams = useSearchParams();
  const searchPageParams = useSearchPageParams();
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const dispatch = useDispatch();

  const onHomePage = showSearchBoxRegex.test(pathname);

  const toggleSort = () => {
    dispatch(
      updateSearchPageParams({
        ...searchPageParams,
        dateDescending: !searchPageParams.dateDescending
      })
    );
  };
  return (
    <Initialize>
      <AdvancedSearchDrawer
        searchParams={searchParams}
        advancedSearchOpen={advancedSearchOpen}
        setAdvancedSearchOpen={setAdvancedSearchOpen}
      />
      <AppBar
        sx={{
          backgroundColor: "transparent",
          borderBottom: "1px solid #E2E8EE",
          color: "#0099dc",
          height: "80px"
        }}
        component={"header"}
        position="static"
        elevation={0}
      >
        <Toolbar
          disableGutters
          sx={{
            display: "grid",
            gridTemplateColumns: onHomePage ? "1.15fr auto 2fr" : "auto",
            gridTemplateRows: "1fr",
            height: "100%"
          }}
        >
          {onHomePage && (
            <>
              <nav
                style={{ height: "100%" }}
                aria-label="app menu"
              >
                <Stack
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ minWidth: "400px", height: "100%" }}
                >
                  <SimpleSearch />

                  <Box sx={{ minWidth: "100px", flex: 1 }}>
                    <IconButton
                      sx={{ marginRight: "10px" }}
                      onClick={() => setAdvancedSearchOpen(true)}
                    >
                      <Badge
                        badgeContent={
                          advancedSearchActive ? advancedSearchFieldCount : 0
                        }
                        color="primary"
                      >
                        <FilterAltIcon />
                      </Badge>
                    </IconButton>
                    <SortToggleButton
                      label="create date"
                      isDescending={searchPageParams?.dateDescending}
                      onClick={toggleSort}
                    />
                  </Box>
                </Stack>
              </nav>
              <Divider
                sx={{ borderColor: "#E2E8EE" }}
                orientation="vertical"
              />
            </>
          )}
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            height="100%"
            px={5}
          >
            <Button
              component={RouterLink}
              onClick={() =>
                dispatch(updateSearchParams({ ...defaultSearchParams }))
              }
              to="/beta"
              sx={{ padding: "8px", marginLeft: "-8px" }}
            >
              <IconButton
                sx={{
                  "&:hover": { background: "transparent" },
                  padding: "0 0 3px 0"
                }}
                color="inherit"
              >
                <HomeIcon titleAccess="home" />
              </IconButton>
              <Typography
                ml={1}
                variant="h6"
                component="span"
              >
                ESS Logbook
              </Typography>
            </Button>
            <nav aria-label="user menu">
              <List
                sx={{
                  display: "flex",
                  padding: "0",
                  gap: "10px"
                }}
              >
                {user ? (
                  <ListItem sx={{ padding: 0 }}>
                    <InternalButtonLink
                      to="/beta/logs/create"
                      color="inherit"
                      startIcon={<AddCircleIcon />}
                    >
                      New Entry
                    </InternalButtonLink>
                  </ListItem>
                ) : null}
                <List
                  aria-label="help menu"
                  sx={{
                    display: "flex"
                  }}
                >
                  <ListItem sx={{ padding: 0 }}>
                    <InternalButtonLink
                      component={RouterLink}
                      startIcon={<HelpCenterIcon titleAccess="help" />}
                      to="/beta/help"
                      color="inherit"
                    >
                      Help
                    </InternalButtonLink>
                  </ListItem>
                </List>
                <ListItem sx={{ padding: "0 0 0 8px" }}>
                  {user?.userName ? (
                    <UserMenu user={user} />
                  ) : (
                    <Button
                      onClick={() => setShowLogin(true)}
                      variant="outlined"
                      color="inherit"
                      startIcon={<LockIcon />}
                    >
                      Sign In
                    </Button>
                  )}
                </ListItem>
              </List>
            </nav>
          </Stack>
          <LoginDialog />
          <LogoutDialog />
        </Toolbar>
      </AppBar>
    </Initialize>
  );
};
export default AppNavBar;
