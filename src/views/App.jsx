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

import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, styled } from "@mui/material";
import { AdvancedSearchDrawer } from "../components/search/AdvancedSearchDrawer";
import { onHomePage } from "../hooks/onPage";
import { AppNavBar } from "src/components/AppNavBar";
import { theme } from "src/config/theme";
import { ologApi } from "src/api/ologApi";

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

const App = styled(({ className }) => {
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);

  ologApi.endpoints.getUser.useQuery({});

  return (
    <>
      {advancedSearchOpen && (
        <Overlay onClick={() => setAdvancedSearchOpen(false)} />
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: onHomePage() ? "auto 2fr" : null,
          gridTemplateRows: "1fr",
          height: "100vh",
          overflow: "auto",
          transition: ""
        }}
      >
        {onHomePage() && (
          <AdvancedSearchDrawer advancedSearchOpen={advancedSearchOpen} />
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
    </>
  );
})({
  "& > *": {
    minHeight: 0
  }
});
export default App;
