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

import { Paper, Stack, Typography } from "@mui/material";
import Initialize from "components/Initialize";
import React from "react";

const BetaApp = () => {

    return (
        <Initialize>
            {/* Stub for initial merge of beta feature */}
            <Stack height="100vh" padding={2} alignItems="center" justifyContent="center" >
                <Paper 
                    elevation={24}
                    square={false}
                    sx={{
                        paddingY: 10,
                        paddingX: 20, 
                        backgroundColor: "primary.main",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "essWhite.main"
                    }}
                >
                    <Typography component="h1" variant="h3">Welcome to the Beta App</Typography>
                    <Typography>This is a placeholder and will be updated as features are added</Typography>
                </Paper>
            </Stack>
        </Initialize>
    )
}
export default BetaApp;