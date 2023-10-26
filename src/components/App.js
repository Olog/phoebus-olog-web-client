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

import React, { useState } from 'react';
import {
  Route,
  Routes
} from "react-router-dom";
import Banner from './Banner';
import EntryEditor from './EntryEditor';
import LogEntriesView from './LogEntriesView';
import { useSelector } from 'react-redux';
import { useGetLogbooksQuery, useGetTagsQuery } from 'services/ologApi';
import { Box } from '@mui/material';
import Initialize from './Initialize';

/**
 * Entry point component.
 */

const App = () => {

    const [userData, setUserData] = useState({userName: "", roles: []});
    const {data: tags = [], error: tagsError} = useGetTagsQuery();
    const {data: logbooks = [], error: logbooksError} = useGetLogbooksQuery();
    const [replyAction, setReplyAction] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const currentLogEntry = useSelector(state => state.currentLogEntry);

    if(tagsError) {
        console.error("Unable to fetch tags", tagsError);
    }
    if(logbooksError) {
        console.error("Unable to fetch tags", logbooksError);
    }

    return(
        <Box id='app-viewport' 
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column"
        }}>
            <Initialize>
                <Banner {...{
                    showLogin, setShowLogin,
                    showLogout, setShowLogout,
                    userData, setUserData,
                    setReplyAction
                }}/>
                <Box id='app-content' 
                    sx={{
                        overflow: "auto",
                        height: "100%"
                }}>
                    <Routes>
                        <Route exact path="/" element={
                            <LogEntriesView {...{
                                tags, 
                                logbooks,
                                userData,
                                setReplyAction, 
                                currentLogEntry
                            }}/>
                        } />
                        <Route exact path="/logs/:id" element={
                            <LogEntriesView {...{
                                tags, 
                                logbooks,
                                userData,
                                setReplyAction, 
                                currentLogEntry
                            }}/>
                        } />
                        <Route path="/edit" element={
                            <EntryEditor {...{
                                tags,
                                logbooks,
                                replyAction, setReplyAction,
                                userData, setUserData,
                                setShowLogin
                            }}/>
                        } />
                    </Routes>
                </Box>
            </Initialize>
        </Box>
    );
}

export default App;
