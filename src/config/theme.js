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

import { createTheme } from "@mui/material";

export let theme = createTheme({});

// Compose ESS Colors
theme = createTheme(theme, {
    palette: {
      essCyan: theme.palette.augmentColor({
        color: {
          main: "#0099dc"
        },
        name: "essCyan"
      }),
      essBlack: "#000000",
      essWhite: theme.palette.augmentColor({
        color: {
          main: "#ffffff"
        },
        name: "essWhite"
      }), 
      essPurple: "#821482",
      essOrange: "#ff7d00",
      essForest: "#006646",
      essGrass: "#99be00",
      essNavy: "#003366"    }
  });

// Compose remaining overrides
theme = createTheme(theme, {
    palette: {
      primary: theme.palette.augmentColor({
        color: {
          main: theme.palette.essCyan.main
        },
        name: "primary"
      }),
      secondary: theme.palette.augmentColor({
        color: {
          main: theme.palette.grey[700]
        },
        name: "secondary"
      }),
      status: {
        ok: theme.palette.success.main,
        progress: theme.palette.warning.light,
        fail: theme.palette.error.main
      }
    },
    components: {
      MuiLink: {
        styleOverrides: {
          root: {
            textDecoration: "none",
            ":hover": {
              textDecoration: "underline"
            }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none'
          }
        }
      }
    }
  });  

export default theme;