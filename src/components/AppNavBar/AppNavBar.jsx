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
  Box,
  Tooltip
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import HomeIcon from "@mui/icons-material/Home";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useDispatch } from "react-redux";
import Initialize from "components/Initialize";
import { InternalButtonLink } from "components/shared/Link";
import { useShowLogin, useShowLogout, useUser } from "features/authSlice";
import LoginDialog from "components/LoginLogout/LoginDialog";
import LogoutDialog from "components/LoginLogout/LogoutDialog";
import { useAdvancedSearch } from "features/advancedSearchReducer";
import SimpleSearch from "components/search/SimpleSearch";
import { SortToggleButton } from "components/search/SortToggleButton";
import { defaultSearchParams } from "features/searchParamsReducer";
import {
  updateSearchPageParams,
  useSearchPageParams
} from "features/searchPageParamsReducer";
import { theme } from "src/config/theme";
import { updateAdvancedSearch } from "src/features/advancedSearchThunk";
import { onHomePage } from "src/hooks/isHomePage";

const AppNavBar = ({ advancedSearchOpen, setAdvancedSearchOpen }) => {
  const user = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { setShowLogin } = useShowLogin();
  const { active: advancedSearchActive, fieldCount: advancedSearchFieldCount } =
    useAdvancedSearch();
  const searchPageParams = useSearchPageParams();
  const dispatch = useDispatch();
  const { setShowLogout } = useShowLogout();

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
      <AppBar
        sx={{
          backgroundColor: "transparent",
          borderBottom: "1px solid #E2E8EE",
          color: "#0099dc"
        }}
        component={"header"}
        position="static"
        elevation={0}
      >
        <Toolbar
          disableGutters
          sx={{
            display: "grid",
            gridTemplateColumns: onHomePage(pathname)
              ? "auto 1.25fr auto 2fr"
              : "auto 1fr auto",
            gridTemplateRows: "1fr",
            height: "70px",
            [theme.breakpoints.down("md")]: {
              height: "auto",
              display: "flex",
              flexDirection: "column-reverse",
              alignItems: "flex-start",
              gap: "20px",
              padding: "10px 0",
              "& > nav": {
                width: "100%"
              },
              "& > div": {
                flexFlow: "column"
              },
              "& > hr": {
                display: "none"
              }
            }
          }}
        >
          <Divider
            sx={{ borderColor: "#E2E8EE" }}
            orientation="vertical"
          />
          {onHomePage(pathname) && (
            <>
              <nav
                style={{ height: "100%" }}
                aria-label="app menu"
              >
                <Stack
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ height: "100%" }}
                >
                  <SimpleSearch />

                  <Box sx={{ minWidth: "100px", flex: 1 }}>
                    <IconButton
                      sx={{
                        marginRight: "10px",
                        backgroundColor: advancedSearchOpen
                          ? "#dedede"
                          : "inherit",
                        "&:hover": {
                          backgroundColor: advancedSearchOpen
                            ? "#dedede"
                            : "#F5F5F5"
                        }
                      }}
                      onClick={() => setAdvancedSearchOpen((prev) => !prev)}
                    >
                      <Tooltip
                        enterDelay={200}
                        title="Filter"
                      >
                        <Badge
                          badgeContent={
                            advancedSearchActive ? advancedSearchFieldCount : 0
                          }
                          color="primary"
                        >
                          <FilterAltIcon sx={{ color: "#616161" }} />
                        </Badge>
                      </Tooltip>
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
              onClick={() => {
                dispatch(updateAdvancedSearch({ ...defaultSearchParams }));
                setAdvancedSearchOpen(false);
                const searchResultList =
                  document.getElementById("searchResultList");
                if (searchResultList) {
                  searchResultList.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  });
                }
              }}
              to="/"
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
                <List
                  aria-label="help menu"
                  sx={{
                    display: "flex"
                  }}
                >
                  <ListItem sx={{ padding: 0 }}>
                    <Tooltip title="Help">
                      <IconButton onClick={() => navigate("/help")}>
                        <HelpOutlineIcon
                          color="primary"
                          titleAccess="help"
                          sx={{ fontSize: "25px" }}
                        />
                      </IconButton>
                    </Tooltip>
                  </ListItem>
                </List>
                {user ? (
                  <ListItem sx={{ padding: 0 }}>
                    <InternalButtonLink
                      to="/logs/create"
                      variant="contained"
                      color="primary"
                      sx={{
                        fontWeight: 600,
                        minWidth: "100px",
                        padding: "6px 15px",
                        fontSize: "0.8rem",
                        boxShadow: "none"
                      }}
                    >
                      Create log
                    </InternalButtonLink>
                  </ListItem>
                ) : null}

                <ListItem sx={{ padding: "0 0 0 8px" }}>
                  {user?.userName ? (
                    <Box>
                      <Button
                        onClick={() => setShowLogout(true)}
                        variant="outlined"
                        color="primary"
                      >
                        {user.userName}
                      </Button>
                    </Box>
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
