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
import Cookies from "universal-cookie";
import { Outlet, useLocation } from "react-router-dom";
import { Box, styled } from "@mui/material";
import { AdvancedSearchDrawer } from "../components/search/AdvancedSearchDrawer";
import { onHomePage } from "../hooks/isHomePage";
import { AppNavBar } from "src/components/AppNavBar";
import Initialize from "components/Initialize";
import { theme } from "src/config/theme";
import { useSearchParams } from "src/features/searchParamsReducer";
import customization from "src/config/customization";

const Overlay = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 2
  }
}));

const cookies = new Cookies();

const App = styled(({ className }) => {
  const searchParams = useSearchParams();
  const { pathname } = useLocation();
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);

  useEffect(() => {
    // Reset cookies if the version has changed
    const versionCookie = cookies.get(customization.versionCookie);
    if (!versionCookie || versionCookie !== customization.VERSION) {
      cookies.remove(customization.searchParamsCookie, { path: "/" });
      cookies.remove(customization.searchPageParamsCookie, { path: "/" });
      cookies.set(customization.versionCookie, customization.VERSION, {
        path: "/"
      });
    }
  }, []);

  return (
    <Initialize>
      {advancedSearchOpen && (
        <Overlay onClick={() => setAdvancedSearchOpen(false)} />
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: onHomePage(pathname) ? "auto 2fr" : null,
          gridTemplateRows: "1fr",
          height: "100vh",
          overflow: "auto",
          transition: ""
        }}
      >
        {onHomePage(pathname) && (
          <AdvancedSearchDrawer
            advancedSearchOpen={advancedSearchOpen}
            searchParams={searchParams}
          />
        )}
        <Box
          className={className}
          sx={{
            display: "flex",
            flexFlow: "column",
            height: "100vh",
            overflow: "auto",
            [theme.breakpoints.down("md")]: {
              width: "auto",
              height: "auto"
            }
          }}
        >
          <AppNavBar
            advancedSearchOpen={advancedSearchOpen}
            setAdvancedSearchOpen={setAdvancedSearchOpen}
          />
          <Outlet />
        </Box>
      </Box>
    </Initialize>
  );
})({
  "& > *": {
    minHeight: 0
  }
});
export default App;
