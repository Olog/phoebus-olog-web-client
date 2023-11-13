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

import React from 'react';
import {
  Route,
  Routes
} from "react-router-dom";
import Banner from './Banner';
import LogEntriesView from './LogEntriesView';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import Initialize from './Initialize';
import EditLogView from 'views/EditLogView';
import CreateLogView from 'views/CreateLogView';
import ReplyLogView from 'views/ReplyLogView';

/**
 * Entry point component.
 */

const App = () => {

    const currentLogEntry = useSelector(state => state.currentLogEntry);

    return(
        <Box id='app-viewport' 
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column"
        }}>
            <Initialize>
                <Banner />
                <Box id='app-content' 
                    sx={{
                        overflow: "auto",
                        height: "100%"
                }}>
                    <Routes>
                        <Route exact path="/" element={
                            <LogEntriesView {...{
                                currentLogEntry
                            }}/>
                        } />
                        <Route exact path="/logs/create" element={
                            <CreateLogView />
                        } />
                        <Route exact path="/logs/:id/edit" element={
                            <EditLogView />
                        } />
                        <Route exact path="/logs/:id/reply" element={
                            <ReplyLogView />
                        } />
                        <Route exact path="/logs/:id" element={
                            <LogEntriesView {...{
                                currentLogEntry
                            }}/>
                        } />
                    </Routes>
                </Box>
            </Initialize>
        </Box>
    );
}

export default App;
