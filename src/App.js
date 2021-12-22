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
import MainApp from './MainApp';
import Banner from './Banner';
import EntryEditor from './EntryEditor';
import LogDetailsDetached from './LogDetailsDetached';

/**
 * Entry point component.
 */
class App extends Component{

    state = {
        userData: {userName: "", roles: []},
        logbooks: [],
        tags: [],
        currentLogEntry: null, // This is the log entry selected by the user and shown in the detailed log view.
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
        fetch(`${process.env.REACT_APP_BASE_URL}/logbooks`)
        .then(response => {if(response.ok){return response.json();} else throw Error("Unable to fetch logbooks");})
        .then(data => this.setState({logbooks: data}))
        .catch(() => this.setState({logbooks: []}));
    }
    
    refreshTags = () => {
        fetch(`${process.env.REACT_APP_BASE_URL}/tags`)
        .then(response => {if(response.ok){return response.json();} else throw Error("Unable to fetch tags");})
        .then(data => {
          if(data){
              this.setState({tags: data});
          }
        })
        .catch(() => this.setState({tags: []}));
    }

    setUserData = (userData) => {
        this.setState({userData: userData});
    }

    setCurrentLogEntry = (logEntry) => {
        this.setState({currentLogEntry: logEntry, showGroup: false});
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
                        <Route exact path="/">
                            <MainApp {...this.state}
                                setCurrentLogEntry={this.setCurrentLogEntry}
                                setReplyAction={this.setReplyAction}
                                setShowGroup={this.setShowGroup}
                                />
                        </Route>
                        <Route path="/edit">
                            <EntryEditor {...this.state}
                                setShowLogin={this.setShowLogin}
                                setUserData={this.setUserData}
                                />
                        </Route>
                        <Route path="/logs/:id" render={(props) => <LogDetailsDetached {...props} 
                            setCurrentLogEntry={this.setCurrentLogEntry}
                            setShowGroup={this.setShowGroup}
                            currentLogEntry={this.state.currentLogEntry}/>}>
                        </Route>
                    </Switch>
                   
                </Router>
            </>
        );
    }
}

export default App;
