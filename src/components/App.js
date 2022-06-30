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

import React, { useCallback, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Banner from './Banner/Banner';
import EntryEditor from './EntryEditor/EntryEditor';
import LogEntriesView from './LogEntriesView/LogEntriesView';
import ologService from '../api/olog-service';
import { Col, Container, Row } from 'react-bootstrap';

/**
 * Entry point component.
 */
const App = () => {

    const [userData, setUserData] = useState({userName: "", roles: []});
    const [logbooks, setLogbooks] = useState([]);
    const [tags, setTags] = useState([]);
    const [replyAction, setReplyAction] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const [showGroup, setShowGroup] = useState(false);
    const [currentLogEntry, setCurrentLogEntry] = useState(null);

    const refreshLogbooks = useCallback(() => {
        ologService.get('/logbooks')
        .then(res => setLogbooks(res.data))
        .catch((e) => {
            console.error("Unable to fetch logbooks", e);
            setLogbooks([]);
        });
    }, []);
    
    const refreshTags = useCallback(() => {
        ologService.get('/tags')
            .then(res => setTags(res.data))
            .catch((e) => {
                console.error("Unable to fetch tags", e);
                setTags([]);
            });
    }, []);

    useEffect(() => {
        refreshLogbooks();
        refreshTags();
    }, [refreshLogbooks, refreshTags]);

    useEffect(() => {
        setShowGroup(false);
    }, [currentLogEntry])

    return(
        <>
            <Router>
                <Container fluid className='h-100 p-0'>
                    <Row noGutters className='h-100 flex-column'>
                        <Col sm={'auto'}>
                            <Banner {...{
                                refreshLogbooks,
                                refreshTags,
                                showLogin, setShowLogin,
                                showLogout, setShowLogout,
                                userData, setUserData,
                                setReplyAction
                            }}/>
                        </Col>
                        <Col>      
                            <Switch>
                                <Route exact path={["/", "/logs/:id"]}>
                                    <LogEntriesView {...{
                                        tags, 
                                        logbooks,
                                        userData,
                                        setReplyAction, 
                                        showGroup, setShowGroup,
                                        currentLogEntry, setCurrentLogEntry
                                    }}/>
                                </Route>
                                <Route path="/edit">
                                    <EntryEditor {...{
                                        tags,
                                        logbooks,
                                        replyAction,
                                        userData, setUserData,
                                        currentLogEntry
                                    }}/>
                                </Route>
                            </Switch>
                        </Col>
                    </Row>
                </Container>
            </Router>
        </>
    );
}

export default App;
