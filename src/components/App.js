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

import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Banner from './Banner/Banner';
import EntryEditor from './EntryEditor/EntryEditor';
import LogEntriesView from './LogEntriesView/LogEntriesView';
import ologService from '../api/olog-service';

/**
 * Entry point component.
 */
class App extends Component{

    state = {
        userData: {userName: "", roles: []},
        logbooks: [],
        tags: [],
        // currentLogEntry: null, // This is the log entry selected by the user and shown in the detailed log view.
        replyAction: false,
        showLogin: false,
        showLogout: false,
        showGroup: false
    }

    componentDidMount() {
        // Logbooks and tags are public to read
        this.refreshLogbooks();
        this.refreshTags();
    }

    refreshLogbooks = () => {
        ologService.get('/logbooks')
        .then(res => this.setState({logbooks: res.data}))
        .catch((e) => {
            console.error("Unable to fetch logbooks", e);
            this.setState({logbooks: []});
        });
    }
    
    refreshTags = () => {
        ologService.get('/tags')
            .then(res => this.setState({tags: res.data}))
            .catch((e) => {
                console.error("Unable to fetch tags", e);
                this.setState({tags: []})
            });
    }

    setUserData = (userData) => {
        this.setState({userData: userData});
    }

    setReplyAction = (reply) => {
        this.setState({replyAction: reply});
    }

    setShowLogin = (show) => {
        this.setState({showLogin: show});
    } 
    
    setShowLogout = (show) => {
        this.setState({showLogout: show});
    }

    setShowGroup = (val) => {
        this.setState({showGroup: val});
    }

    hipp = () => {
        return(
            <div>Hello World</div>
        )
    }

    render(){
        return(
            <>
                <Router>
                    
                    <Banner {...this.state}
                            refreshLogbooks={this.refreshLogbooks}
                            refreshTags={this.refreshTags}
                            setShowLogin={this.setShowLogin}
                            setShowLogout={this.setShowLogout}
                            setUserData={this.setUserData}
                            setReplyAction={this.setReplyAction}/>
                    <Switch>
                        <Route exact path={["/", "/logs/:id"]}>
                            <LogEntriesView {...{
                                tags: this.state.tags, 
                                logbooks: this.state.logbooks,
                                userData: this.state.userData,
                                setReplyAction: this.setReplyAction, 
                                showGroup: this.state.showGroup, setShowGroup: this.setShowGroup}}
                            />
                        </Route>
                        <Route path="/edit">
                            <EntryEditor {...this.state}
                                setShowLogin={this.setShowLogin}
                                setUserData={this.setUserData}
                                />
                        </Route>
                    </Switch>
                   
                </Router>
            </>
        );
    }
}

export default App;
