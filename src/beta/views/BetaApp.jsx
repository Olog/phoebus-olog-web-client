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

import { Outlet } from "react-router-dom";
import { Box, styled } from "@mui/material";
import { AppNavBar } from "beta/components/navigation/AppNavBar";
import Initialize from "components/Initialize";
import { theme } from "src/config/theme";

const BetaApp = styled(({ className }) => {
  return (
    <Initialize>
      <Box
        className={className}
        sx={{
          display: "block",
          height: "100dvh",
          width: "100dvw",
          [theme.breakpoints.down("md")]: {
            width: "auto",
            height: "auto"
          }
        }}
      >
        <AppNavBar />
        <Outlet />
      </Box>
    </Initialize>
  );
})({
  "& > *": {
    minHeight: 0
  }
});
export default BetaApp;
