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
    ologCyan: theme.palette.augmentColor({
      color: {
        main: "#0099dc",
      },
      name: "ologCyan",
    }),
    ologBlack: theme.palette.augmentColor({
      color: {
        main: "#000000",
      },
      name: "ologBlack",
    }),
    ologWhite: theme.palette.augmentColor({
      color: {
        main: "#ffffff",
      },
      name: "ologWhite",
    }),
    ologPurple: theme.palette.augmentColor({
      color: {
        main: "#821482",
      },
      name: "ologPurple",
    }),
    ologOrange: theme.palette.augmentColor({
      color: {
        main: "#ff7d00",
      },
      name: "ologOrange",
    }),
    ologForest: theme.palette.augmentColor({
      color: {
        main: "#006646",
      },
      name: "ologForest",
    }),
    ologGrass: theme.palette.augmentColor({
      color: {
        main: "#99be00",
      },
      name: "ologGrass",
    }),
    ologNavy: theme.palette.augmentColor({
      color: {
        main: "#003366",
      },
      name: "ologNavy",
    }),
  },
});

// Compose remaining overrides
theme = createTheme(theme, {
  palette: {
    primary: theme.palette.augmentColor({
      color: {
        main: theme.palette.ologCyan.main,
      },
      name: "primary",
    }),
    secondary: theme.palette.augmentColor({
      color: {
        main: theme.palette.grey[700],
      },
      name: "secondary",
    }),
    status: {
      ok: theme.palette.success.main,
      progress: theme.palette.warning.light,
      fail: theme.palette.error.main,
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
          ":hover": {
            textDecoration: "underline",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

export default theme;
